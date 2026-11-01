# 事故編輯指南（給每日編輯 `data/items.json` 的助理）

本指南說明每新增一筆事故時，`en`（英文）與 `geo`（地圖）兩組欄位怎麼填。原有的中文欄位（`sort`、`date`、`month`、`area`、`place`、`cargo`、`type`、`value`、`summary`、`site`、`url`）規則見 `README.md`，**不要改既有的中文欄位**。

## 1. 欄位總覽

每筆事故的真實結構（以第 13 筆為例）：

```json
{
  "sort": "2026-02-15",
  "date": "2026-02",
  "month": "2026-02",
  "area": "美國",
  "place": "加州 Fullerton → 俄亥俄州 Columbus",
  "cargo": "顯示卡",
  "type": "運輸竊盜",
  "value": "150 萬美元",
  "summary": "拖車自 Fullerton 消失，來源為業界 BOLO 通報。",
  "site": "Washington Post（Yahoo）",
  "url": "https://www.yahoo.com/news/articles/cargo-thieves-stealing-millions-dollars-090000882.html",
  "en": {
    "date": "Feb 2026",
    "area": "United States",
    "place": "Fullerton, California to Columbus, Ohio",
    "cargo": "Graphics cards (GPUs)",
    "type": "Cargo theft in transit",
    "value": "US$1.5 million",
    "summary": "The trailer disappeared from Fullerton, according to an industry BOLO alert."
  },
  "geo": {
    "mapped": true,
    "states": ["CA", "OH"],
    "origin": { "state": "CA", "city": "Fullerton" },
    "dest": { "state": "OH", "city": "Columbus" }
  }
}
```

`site` 與 `url` 是來源名稱與連結，不翻譯、不放進 `en`。

## 2. `en` 欄位怎麼填

`en` 物件固定七個欄位：`date`、`area`、`place`、`cargo`、`type`、`value`、`summary`。

### 翻譯原則

- 使用專業的保險與貨運風險英文，例如 cargo theft、in-transit loss、warehouse theft、hijacking、fictitious pickup、carrier impersonation、subrogation claim、load board、escort vehicle。
- **金額與事實不可更改，也不可新增原文沒有的資訊。** 中文的「萬」要換算：1 萬 = 10,000，「150 萬美元」= US$1.5 million，「約 47 萬美元」= about US$470,000，「3,800 萬美元」= US$38 million。
- 專有名詞、公司名、地名、案號（例如 `3:26-cv-03636`）、百分比原樣保留。
- 「約」寫成 `Approx.`（日期）或 `about`（金額）。「日期未公開」寫成 `date not disclosed`。「（起訴）」寫成 `(indictment)`。
- 地名用英文州名全名（California，不是 CA）。
- 數值或日期範圍一律用 `to`，例如 `June to August 2026`。

### 禁用破折號（重要）

英文欄位**不得**出現 em dash（—）、en dash（–），也不得把前後有空格的連字號（` - `）當破折號用。需要停頓時改用逗號、句號、冒號、分號，或用 `to`、`and` 連接。單字內的連字號（in-transit、off-duty、load-board）允許。

### `date`

用英文日期，不要放 ISO 格式（`2026-09-21`）：

| 中文 `date` | 英文 `en.date` |
| --- | --- |
| `2026-09-24` | `Sep 24, 2026` |
| `2026-06` | `Jun 2026` |
| `2026-06（日期未公開）` | `Jun 2026 (date not disclosed)` |
| `2025-11-05（起訴）` | `Nov 5, 2025 (indictment)` |
| `約 2026-03` | `Approx. Mar 2026` |
| `2026-06～08（日期未公開）` | `June to August 2026 (date not disclosed)` |

### `area`

`美國` = `United States`、`巴西` = `Brazil`。其他國家用英文國名。

### `type`

中文 `type` 的值是程式用的資料鍵，**不可改**。`en.type` 填對應的英文顯示名稱（也可省略，程式會依字典顯示同樣的英文）：

| 中文 `type` | `en.type` |
| --- | --- |
| `運輸竊盜` | `Cargo theft in transit` |
| `劫車` | `Hijacking` |
| `倉儲竊盜` | `Warehouse theft` |
| `追回查獲` | `Recovery or seizure` |
| `理賠與訴訟` | `Claims and litigation` |

### `place`、`cargo`、`value`、`summary`

逐句忠實翻譯。對照詞：承運人 = carrier、經紀商 = broker、護衛車 = escort vehicle、下班警察 = off-duty police officer、貨運撮合平台 = load board、拖車 = trailer、顯示卡 = graphics cards (GPUs)、伺服器 = servers、資料中心 = data center、代位求償 = subrogation claim、偽冒承運人 = carrier impersonation 或 fictitious pickup（依原文語意，不要加原文沒有的事實）。

## 3. `geo` 欄位怎麼填

```
"geo": {
  "mapped": true | false,
  "states": ["CA", ...],
  "origin": { "state": "CA", "city": "Mojave" } | null,
  "dest":   { "state": "GA", "city": "Fayetteville" } | null,
  "point":  { "state": "CA", "city": "Fremont" },     // 選填，單一地點才用
  "note": "簡短中文說明"                               // 選填，mapped:false 時必填
}
```

### 基本規則

1. **只使用 `place` 欄位明寫的州與城市。絕對不可自行補地點、猜城市或編座標。**
2. `states`：兩字母美國郵遞區號縮寫（`CA`、`TX`、`DC`…）。只放 `place` 明寫的州。縮寫寫錯時，地圖會直接忽略該州，不會報錯，但事故也就不會被計入該州。
3. `origin` / `dest`：`place` 寫成「A → B」時填。兩端都存在才會畫弧線。
4. `point`：只有單一地點、且有明寫城市時用（在地圖上畫一個圓點）。此時 `origin`、`dest` 設為 `null`。
5. 只寫州、沒寫城市時，`origin` / `dest` 只填 `{ "state": "TX" }`，不要加 `city`。
6. 只有目的地（例如「運往亞利桑那州 Mesa」）：`origin` 設為 `null`，`dest` 與 `point` 填 Mesa。不會畫路線，只畫一個點。
7. `city` 必須已存在於 `data/geo/city_coords.json`（鍵的格式是 `"城市, 州縮寫"`，例如 `"Fullerton, CA"`）。**若不存在，請只填 `state`，不要填 `city`**，該端會以州中心估計並以虛線顯示。要新增城市請見第 7 節。

### 一律 `mapped: false` 的情況

沒有明確的美國地點時，一律 `mapped: false`、`states: []`、`origin` 與 `dest` 為 `null`，並在 `geo.note` 用中文寫明原因：

- `place` 只寫「美國」，沒有州或城市。
- 法院案件、仲裁、詐欺中介等沒有實際運輸地點的條目。
- 非美國地點（例如巴西）。

未標示的事故不會畫在地圖上，但仍會列在「事故明細」，並出現在地圖下方的「N 筆未標示」說明與展開清單。

### 特殊情況

- `place` 提到郡（例如 Cook County）而非城市時，不要當成城市。只填明寫的州，不畫路線，不填 `city`。
- `place` 寫多個州但沒有「A → B」的起訖關係時，只列 `states`，`origin`、`dest` 為 `null`。

## 4. 完整範例

以下全部取自現有資料。

### 範例 A：有起訖的路線事故（第 9 筆）

`place` 為「加州 Mojave 一帶 → 喬治亞州 Fayetteville」。

```json
{
  "sort": "2026-06-10",
  "date": "2026-06（日期未公開）",
  "month": "2026-06",
  "area": "美國",
  "place": "加州 Mojave 一帶 → 喬治亞州 Fayetteville",
  "cargo": "電腦伺服器設備",
  "type": "劫車",
  "value": "1,300 萬美元",
  "summary": "不明轎車撞上受雇護送的下班警察，拖車隨後被取走。",
  "site": "NY Post（引 NBC）",
  "url": "https://nypost.com/2026/10/27/business/crooks-have-pulled-off-100m-in-ai-data-center-equipment-heists-since-june-report/",
  "en": {
    "date": "Jun 2026 (date not disclosed)",
    "area": "United States",
    "place": "Around Mojave, California to Fayetteville, Georgia",
    "cargo": "Computer server equipment",
    "type": "Hijacking",
    "value": "US$13 million",
    "summary": "An unidentified sedan struck an off-duty police officer hired as escort, and the trailer was then taken."
  },
  "geo": {
    "mapped": true,
    "states": ["CA", "GA"],
    "origin": { "state": "CA", "city": "Mojave" },
    "dest": { "state": "GA", "city": "Fayetteville" }
  }
}
```

### 範例 B：單一地點事故（第 19 筆）

`place` 為「加州 Fremont」，單一城市，所以用 `point`。

```json
{
  "sort": "2025-06-03",
  "date": "2025-06",
  "month": "2025-06",
  "area": "美國",
  "place": "加州 Fremont",
  "cargo": "NVIDIA 晶片",
  "type": "倉儲竊盜",
  "value": "約 20 萬美元",
  "summary": "倉庫竊案，涉案晶片價值約 20 萬美元。",
  "site": "Washington Post（Yahoo）",
  "url": "https://www.yahoo.com/news/articles/cargo-thieves-stealing-millions-dollars-090000882.html",
  "en": {
    "date": "Jun 2025",
    "area": "United States",
    "place": "Fremont, California",
    "cargo": "NVIDIA chips",
    "type": "Warehouse theft",
    "value": "About US$200,000",
    "summary": "A warehouse theft involving chips valued at about US$200,000."
  },
  "geo": {
    "mapped": true,
    "states": ["CA"],
    "origin": null,
    "dest": null,
    "point": { "state": "CA", "city": "Fremont" },
    "note": "單一地點"
  }
}
```

### 範例 C：`mapped: false`（第 10 筆，法院案件）

```json
{
  "sort": "2026-06-18",
  "date": "2026-06-18",
  "month": "",
  "area": "美國",
  "place": "美國南加州聯邦地方法院",
  "cargo": "Super Micro 出貨之伺服器",
  "type": "理賠與訴訟",
  "value": "未揭露",
  "summary": "AGCS Marine Insurance 等人依 Carmack 修正案對 Super Micro 等提告（案號 3:26-cv-03636，標的為 2025-04 運送途中失竊的 32 台伺服器）；9/16 提出答辯、9/28 提出交叉請求，10/28 收到移轉函。",
  "site": "Docket Nexus",
  "url": "https://docketnexus.com/case/agcs-marine-insurance-company-et-al-v-super-micro-computer-inc-et-al--casd-860050/",
  "en": {
    "date": "Jun 18, 2026",
    "area": "United States",
    "place": "U.S. District Court in Southern California",
    "cargo": "Servers shipped by Super Micro",
    "type": "Claims and litigation",
    "value": "Not disclosed",
    "summary": "AGCS Marine Insurance and others sued Super Micro and others under the Carmack Amendment (case no. 3:26-cv-03636, concerning 32 servers stolen in transit in April 2025). An answer was filed on Sep 16, a cross-claim on Sep 28, and a transfer letter was received on Oct 28."
  },
  "geo": {
    "mapped": false,
    "states": [],
    "origin": null,
    "dest": null,
    "note": "法院案件，無實際運輸地點"
  }
}
```

## 5. 向下相容

- 沒有 `en` 的舊資料：英文模式會逐欄退回中文，不會報錯。`en` 只填一部分欄位也可以，缺的欄位退回中文。`en.type` 缺少時，程式依字典顯示英文類型。
- 沒有 `geo` 的舊資料：視為「未標示」，不會畫在地圖上，仍列於事故明細與地圖下方的未標示清單。
- `geo.states` 裡寫錯的州縮寫、`origin` / `dest` / `point` 缺失、`city` 不在座標表：都不會讓頁面出錯，地圖安靜忽略或改用州中心估計。
- `en` 與 `geo` 都不影響事故件數、月份長條圖與類型分布，那些只看中文 `type` 與 `month`。

## 6. 每日自我檢查清單

存檔前逐項確認：

- [ ] `items.json` 是合法 JSON（無註解、無尾端逗號、UTF-8）。
- [ ] 新增的每一筆都有完整的 `en`（七個欄位）與 `geo`。
- [ ] `geo.states` 的每個縮寫都是有效的兩字母美國州縮寫（含 `DC`），而且該州確實明寫在 `place`。
- [ ] `origin` / `dest` / `point` 的 `city` 都存在於 `data/geo/city_coords.json`，否則已刪除 `city` 只留 `state`。
- [ ] 沒有編造任何地點或座標；`mapped: false` 的條目有中文 `geo.note`。
- [ ] 中英數字一致：金額、件數、百分比、日期、案號都與中文欄位對得上（萬 → 10,000 的換算要再核對一次）。
- [ ] 英文欄位沒有 em dash（—）、en dash（–）、或前後有空格的 ` - `；範圍用 `to`。
- [ ] 英文日期不是 ISO 格式（用 `Oct 30, 2026` 或 `Oct 2026`）。
- [ ] 既有的中文欄位沒有被改動。
- [ ] `data/meta.json` 的 `last_updated` 已更新；若頁首指標或趨勢文字受影響，`meta.json` 的 `en.trends`、`en.headlines` 也同步修改。

## 7. 如何新增城市座標

`data/geo/city_coords.json` 的格式：

```json
{
  "_source": "…來源說明…",
  "_key": "\"City, ST\" (USPS state code)",
  "cities": {
    "Fremont, CA": {
      "lat": 37.49446,
      "lon": -121.94115,
      "census_name": "Fremont city",
      "geoid": "0626000"
    }
  }
}
```

規則：

- 座標**只能**來自 U.S. Census Bureau 的 Gazetteer 檔（目前使用 2023 Gazetteer Files, Places, national；公有領域）：<https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2023_Gazetteer/2023_Gaz_place_national.zip>。
- `lat` 取欄位 `INTPTLAT`，`lon` 取欄位 `INTPTLONG`（內部點，是城市的近似位置）。
- `census_name` 取欄位 `NAME`，`geoid` 取欄位 `GEOID`，方便日後核對。
- 鍵的格式是 `"城市, 州縮寫"`，城市名稱必須與 `items.json` 的 `geo` 裡寫的 `city` 完全一致。
- **不可手填、估算或憑印象補座標。** 查不到的城市就不要加，`geo` 只填 `state`。
- 若加入新城市，更新檔內 `_source` 的說明，維持「只包含 `data/items.json` 的 `place` 欄位出現過的城市」這一點。
