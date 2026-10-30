# AI 產品運輸保險事故新聞彙整

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

編輯 `data/items.json`，在陣列裡加入一筆物件（建議放在最前面），并把 `data/meta.json` 的 `last_updated` 改成當天日期（`YYYY-MM-DD`）。

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

JSON 不可加註解，也不可在最後一筆後面加逗號。存檔請用 UTF-8。

頁首四張指標裡，「已收錄事故」來自 `items.json` 的筆數。其餘三張（2026 年損失、詐欺比例、單案最高）是頁面上的固定標題數字，改 JSON 不會連動這三張。
