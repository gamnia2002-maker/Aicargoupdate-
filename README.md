# AI 產品運輸保險事故新聞彙整

公開網站：<https://gamnia2002-maker.github.io/Aicargoupdate-/>

公開靜態網頁，彙整 AI 伺服器、GPU、晶片與資料中心設備相關的運輸事故，以及產業報告、媒體調查與保險市場動態。沒有建置步驟：瀏覽器直接讀取 `data/` 裡的 JSON。

事故件數、每月長條圖與類型分布**只計算** `data/items.json`。報告與延伸閱讀另行顯示，不會算進事故件數。

## 本機預覽

在倉庫根目錄啟動一個靜態伺服器（直接用檔案網址開 `index.html` 時，瀏覽器會擋住 JSON）：

```bash
python3 -m http.server 8080
```

然後開啟 <http://localhost:8080>。

## 上線

推送到 `main` 後，GitHub Actions（`.github/workflows/pages.yml`）會把倉庫根目錄部署到 GitHub Pages，不需要在本機建置。

預期網址：<https://gamnia2002-maker.github.io/Aicargoupdate-/>

第一次使用前，請到倉庫 **Settings → Pages → Build and deployment → Source**，選擇 **GitHub Actions**。選過一次之後，每次推上 `main` 就會自動重新部署。也可以在 Actions 分頁手動執行「Deploy GitHub Pages」。

## 新增一筆事故

編輯 `data/items.json`，在陣列裡加入一筆物件（建議放在最前面），並把 `data/meta.json` 的 `last_updated` 改成當天日期（`YYYY-MM-DD`）。

頁面依 `sort` 由新到舊排列，不依陣列位置，所以日期要寫在 `sort`。

| 欄位 | 說明 |
| --- | --- |
| `sort` | 排序用日期，`YYYY-MM-DD`。月份不確定時取當月中旬，例如 `2026-06-15`。 |
| `date` | 畫面上顯示的日期文字，可寫「約」或只有月份。 |
| `month` | 圖表分月，`YYYY-MM`。無法確認月份時留空字串 `""`。空字串不會出現在每月長條圖。 |
| `area` | 地區，例如 `美國`、`巴西`。 |
| `place` | 地點。 |
| `cargo` | 貨物。 |
| `type` | `運輸竊盜`、`劫車`、`倉儲竊盜`、`追回查獲`、`理賠與訴訟` 其中之一，文字必須完全一致。 |
| `value` | 估計價值，沿用來源原文。 |
| `summary` | 摘要。 |
| `site` | 來源名稱。 |
| `url` | 來源連結，需為 `http` 或 `https`。 |

`理賠與訴訟` 會出現在明細與類型分布，但不計入「最新事故」輪播與每月長條圖。只有 `month` 有值、且類型屬於前四類的資料才會計入每月長條圖。

頁首寫的是「收錄 N 則事故（含 M 則理賠與訴訟）」：N 是 `items.json` 的總筆數，M 是其中類型為理賠與訴訟的筆數。「已收錄事故」那張指標也是總筆數，下方日期是資料裡最早到最晚的 `month`，都會自動算，不必改程式。

## 每月長條圖

圖表固定畫出所選西曆年的 1 月到 12 月。沒有事故的月份顯示 0；還沒到的月份留空。預設年份是資料裡最晚的一年。年份按鈕來自 `month` 與 `sort`，某一年有新資料時按鈕會自己出現，程式裡不寫死年份或月份。

圖下註記會寫該年實際畫進長條的則數，以及該年 `sort` 落在這一年、但 `month` 留空所以沒畫進去的則數。

## 新增一則報告

編輯 `data/reports.json`。報告不會改變事故件數或圖表。

| 欄位 | 說明 |
| --- | --- |
| `sort` | 排序用日期，`YYYY-MM-DD`。 |
| `date` | 顯示日期。 |
| `kind` | `產業報告`、`媒體調查`、`保險市場` 其中之一。 |
| `scope` | 地理範圍。 |
| `title` | 標題。 |
| `value` | 關鍵數字或一句重點。 |
| `summary` | 摘要。 |
| `site` | 來源名稱。 |
| `url` | 來源連結。 |

## 更新日期與延伸閱讀

`data/meta.json`：

- `last_updated`：頁首「最後更新」。
- `extra_sources`：延伸閱讀。每筆有 `title`、`site`、`href`；`date` 可以省略。
- `trends`：重點趨勢，字串陣列，由上到下。這三段是手寫的，資料變了要自己改。
- `headlines`：頁首另外三張指標（損失、詐欺比例、單案最高）。每筆有 `target`（數字）、`format`（`{n}` 會換成整數，例如 `US${n}M+`）、`label`、`detail`、`color`。這三張不會跟著事故筆數自動改，要手動更新。

JSON 不可加註解，也不可在最後一筆後面加逗號。存檔請用 UTF-8。

## 免責聲明

頁首摘要下方與頁尾都有免責聲明（中文與英文）。這段是固定聲明，更新資料時不要刪掉，也不要改寫。
