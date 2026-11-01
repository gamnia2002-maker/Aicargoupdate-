# 美國事故地圖作法

網頁沒有建置步驟，地圖由瀏覽器直接讀取本機檔案繪製，不呼叫任何外部地圖服務或 CDN。

## 使用的檔案

| 檔案 | 用途 |
| --- | --- |
| `vendor/d3-array.min.js` | D3 依賴（d3-array 3.2.4） |
| `vendor/d3-geo.min.js` | 投影與路徑（d3-geo 3.1.1） |
| `vendor/topojson-client.min.js` | 解 TopoJSON（topojson-client 3.1.0） |
| `data/geo/us-states-albers-10m.json` | 美國各州邊界（us-atlas 3.0.1 `states-albers-10m`） |
| `data/geo/city_coords.json` | 城市座標（US Census 2023 Gazetteer） |
| `data/geo/us-atlas.LICENSE.txt` | us-atlas 授權全文 |

三支 script 皆為 UMD，載入後提供全域 `d3` 與 `topojson`。`index.html` 依序載入 d3-array、d3-geo、topojson-client，最後才是 `app.js`（全部 `defer`，保持順序）。

## 底圖

- us-atlas 的 `states-albers-10m` 已預先用 Albers USA 投影成 975 x 610 的平面座標，阿拉斯加與夏威夷以插圖方式放在左下。
- 因此繪製州別路徑只需 `d3.geoPath()`（不帶 projection），SVG 的 `viewBox` 為 `0 0 975 610`，寬度 100%、高度自動。
- `topojson.feature(topo, topo.objects.states)` 取出各州 feature；`feature.id` 是州 FIPS 字串（例如 `"06"`），`properties.name` 是英文州名。程式內有 FIPS 轉 USPS 縮寫的對照表（50 州加 DC），以及 USPS 轉繁體中文州名的對照表。
- 資料檔與函式庫在第一次繪製時才載入並快取，切換語言不會重新抓取。載入失敗或函式庫不存在時，地圖區塊只顯示說明文字，其他頁面功能不受影響。

## 事故數與色階

- 每州的事故數 = `items.json` 中 `geo.mapped === true` 且 `geo.states` 含該州的筆數（縮寫不在底圖內的會被忽略）。
- 填色分成 `min(5, 最大值)` 級，從 `#95CAFF` 到 `#000F47`；0 筆的州用淡灰藍 `#E8EEF6`。最大值很小時（例如只有 1）也只用一級，仍能和 0 筆區分。
- 有事故的州在州中心顯示數字，依底色亮度選白字或深字，並加一圈細描邊確保可讀。
- 州別路徑可用鍵盤操作（`tabindex`、`role="button"`、`aria-label`，Enter 或空白鍵切換）。選取與鍵盤焦點都以疊加的 SVG 描邊呈現（不使用瀏覽器的方框 outline）。
- 地圖下方的「州別排行 chips」是小州或手指點不準時的備援，點擊等同選取該州。

## 城市座標與投影

- 城市座標來自 U.S. Census Bureau 2023 Gazetteer Files（Places, national）的內部點（`INTPTLAT`、`INTPTLONG`），是城市的近似位置，屬公有領域。檔案只包含 `items.json` 出現過的城市。
- 把 `[lon, lat]` 投影到底圖座標用：

  ```js
  d3.geoAlbersUsa().scale(1300).translate([487.5, 305])
  ```

  這組參數與 us-atlas 預投影一致。
- 絕不自行編造座標：城市不在座標表、或投影結果為 `null` 時，退回該州的中心點（`d3.geoPath().centroid(feature)`），並把該端標為「近似」。

## 路線與點

- `geo.origin` 與 `geo.dest` 都存在且可解析時，畫一條二次貝茲弧線：控制點位於兩點中點正上方，偏移量為兩點距離的 25%，所以重疊的路線可以分辨。線色是該事故 `type` 的顏色，線寬 2，線條本身不接收滑鼠事件（避免擋住州的點擊）。
- 起點是空心小圓，終點是實心小圓；圓圈有 hover 說明（日期加地點，依語言取英文欄位），點擊會選取該端所在的州。
- **虛線規則**：任一端是以州中心估計（沒有 `city`，或 `city` 不在座標表），整條弧線畫成虛線。圖例明寫「虛線表示起訖點以州中心估計，非實際路線」。所有弧線都只是示意起訖兩地，不是實際行車路線。
- 只有單一地點（`geo.point`）的事故畫一個實心圓點。若同一座標有多筆，後面的圓點會往右上略微錯開，並用半透明疊加，讓重疊看得出來。
- 只有一端存在的事故（例如只知目的地）不畫路線，僅在有 `geo.point` 時畫點。
- 選取某州時，與該州無關的路線與點降為 0.15 透明度。

## 未標示規則

沒有 `geo`、`geo.mapped` 不是 `true`、或 `geo.states` 為空的事故視為「未標示」：不畫在地圖上，仍列於「事故明細」。地圖下方會顯示「N 筆未標示」的說明與一個展開鈕，可展開這些事故的卡片。典型情況是非美國地點、只寫「美國」而無州、以及法院或詐欺中介案件。

## 授權與出處

| 元件 | 授權 | 備註 |
| --- | --- | --- |
| us-atlas（`data/geo/us-states-albers-10m.json`） | ISC | 授權全文見 `data/geo/us-atlas.LICENSE.txt`；底圖資料源自 U.S. Census Bureau 的邊界資料 |
| D3（d3-array、d3-geo） | ISC | 檔頭保留版權聲明 |
| topojson-client | ISC | 檔頭保留版權聲明 |
| US Census 2023 Gazetteer（`data/geo/city_coords.json`） | 公有領域 | 美國聯邦政府資料 |
