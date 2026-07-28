/* ===================== 桃子工作台 · 浮山雲 ===================== */
(function () {
  "use strict";

  /* ---------- 桃子图标（保留桃色） ---------- */
  function peachSVG() {
    return '<svg viewBox="0 0 64 64">' +
      '<path class="peach-leaf" d="M38 13 Q53 3 59 14 Q48 25 38 16 Z" fill="#7fb069"/>' +
      '<path class="peach-body" d="M32 18 C19 18 11 28 12.5 39.5 C14 53 24 60.5 32 60.5 C40 60.5 50 53 51.5 39.5 C53 28 45 18 32 18 Z" fill="#ff9478"/>' +
      '<path d="M32 20 C30 32 30.5 48 32 60.5" stroke="#ff7a6b" stroke-width="2.2" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="23" cy="34" rx="5" ry="3.4" fill="#ffd9cf" opacity="0.75"/>' +
      '</svg>';
  }
  document.querySelectorAll(".nav-icon").forEach(function (el) { el.innerHTML = peachSVG(); });
  document.getElementById("brandPeach").innerHTML = peachSVG();
  document.getElementById("modalPeach").innerHTML = peachSVG();

  /* ---------- 工具 ---------- */
  var STORE = "peach_workbench_v1";
  function todayStr() {
    var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }
  function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function rng(seedStr) {
    var h = 2166136261 >>> 0;
    var s = String(seedStr);
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () {
      h += 0x6d2b79f5; var t = h;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(arr, r) { return arr[Math.floor(r() * arr.length)]; }
  function load() { try { return JSON.parse(localStorage.getItem(STORE)) || null; } catch (e) { return null; } }
  function save() { try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------- 品牌信息 ---------- */
  var BRAND = { name: "浮山雲", slogan: "用好料，做好茶", promise: "茂名人可以放心喝的茶饮", city: "茂名" };

  /* ---------- 内容库 ---------- */
  var DAILY_PRESETS = [
    "浮山雲选题每日更新（对标古茗视频号）", "热门视频二创", "内容覆盖（各类爆款二创）",
    "小红书产品每日内容更新", "重点新闻浏览", "阅读跟读练习", "奶茶话术词汇积累"
  ];

  var STORY_ANGLES = [
    { angle: "初心故事", ref: "对标古茗视频号「创始人口播 / 品牌温度」：生活化、真诚、有家乡情",
      hook: ["在茂名做茶饮的第 N 天，我一直在想一件事——", "为什么茂名人总说，想喝一杯放心的茶这么难？"],
      beats: ["创始人的初心：不卖香精、不卖套路，只做自己孩子也敢喝的那杯茶。",
        "「" + BRAND.slogan + "」不是口号，是选料底线：茶叶挑产地、鲜果当日切、奶源可溯源。",
        "从一家小店到" + BRAND.city + "街角，靠的不是营销，是街坊一句「这家能放心喝」。"],
      cta: "来浮山雲，喝一杯" + BRAND.city + "人自己的、敢让全家喝的好茶。" },
    { angle: "好料溯源", ref: "对标古茗视频号「原料特写 / 产品溯源」：明亮、产品大特写、口播有温度",
      hook: ["你喝的那杯茶，茶叶到底好不好？今天带你看见浮山雲的底气。", "一杯好茶七分在料，我们的料敢摊开给你看。"],
      beats: ["茶叶：核心产区，拒绝碎茶香精，每一泡都经得起闻。", "鲜果：每日鲜切不过夜；奶源：可溯源纯牛奶，不安劣质植脂末。",
        "配料表公开上屏——「" + BRAND.slogan + "」，是我们对" + BRAND.city + "街坊的承诺。"],
      cta: "看得到的料才喝得放心。今天来浮山雲，喝一杯真材实料。" },
    { angle: "本地骄傲", ref: "对标古茗视频号「城市烟火 / 门店日常」：市井温情、本地共鸣强",
      hook: [BRAND.city + "人的快乐很简单：下班一杯浮山雲，解一天乏。", "全国都在加盟，我们只想做好" + BRAND.city + "人自己的茶饮。"],
      beats: [BRAND.city + "的天气、口味、节奏我们都懂——甜度冰量按本地习惯调。", "不盲目追网红款，只做" + BRAND.city + "人天天想喝、敢天天喝的那杯。",
        "「" + BRAND.promise + "」——这是浮山雲写给家乡的情书。"],
      cta: "支持本土品牌，从一杯放心茶开始。浮山雲，就在你身边。" },
    { angle: "匠心制作", ref: "对标古茗视频号「出杯流程 / 标准化」：节奏明快、工艺特写",
      hook: ["一杯浮山雲，从备料到出杯要经过这几步。", "好喝不是玄学，是每一步都不偷懒。"],
      beats: ["备料：鲜果现切、茶汤现萃，温度时间都有标准。", "调制：按比例按口感，少一克甜都尝得出来。", "出杯：封口擦拭递到你手里——「" + BRAND.slogan + "」落在细节里。"],
      cta: "认真做的每一杯都值得放心喝。今天来一杯？" },
    { angle: "食品安全·透明", ref: "对标古茗视频号「明厨亮灶 / 信任状」：真实、敢拍后厨",
      hook: ["敢把后厨拍给你看，才敢说「放心喝」。", "你担心的添加剂，我们在浮山雲提前替你挡掉了。"],
      beats: ["原料可查、日期可追，临期一律不用。", "操作台每班次清洁，滤网冰槽天天消毒。", "「" + BRAND.promise + "」不是广告词，是可被检验的标准。"],
      cta: "喝得安心才喝得长久。浮山雲把放心写在流程里。" },
    { angle: "顾客信任", ref: "对标古茗视频号「用户故事 / 真实反馈」：真实顾客、口语化",
      hook: ["有位阿姨每天下午都来浮山雲——她说了句让我们踏实的话。", "被街坊信任，是浮山雲最贵的资产。"],
      beats: ["「给孩子也买，喝着放心」——这是" + BRAND.city + "家长最朴素的认可。", "复购不是靠折扣，是靠「这杯我能天天喝」。", "「" + BRAND.slogan + "」换来一句：浮山雲，信得过。"],
      cta: "被信任我们就更不敢马虎。来浮山雲，喝被街坊认证的茶。" },
    { angle: "平价良心", ref: "对标古茗视频号「性价比种草」：价格锚点、真诚推荐",
      hook: ["用好料就一定贵吗？浮山雲想掰碎这个误区。", "一杯放心茶不该是奢侈。"],
      beats: ["好料和价格不画等号：源头直采，把中间差价让给" + BRAND.city + "街坊。", "常驻平价款，学生打工人也天天喝得起。", "「" + BRAND.slogan + "」，良心定价也是品牌一部分。"],
      cta: "喝好茶不花冤枉钱。浮山雲，平价也能很放心。" },
    { angle: "时令限定", ref: "对标古茗视频号「节气 / 新品」：应季、有仪式感",
      hook: [BRAND.city + "的夏天，该有一杯属于这时的浮山雲。", "不跟风全国款，只做这个季节" + BRAND.city + "人想喝的。"],
      beats: ["当季鲜果入茶，风味新鲜度都最在线。", "限时不做长线，喝的是「刚好这时节」的仪式感。", "「" + BRAND.slogan + "」，时令也是用好料的一种方式。"],
      cta: "错过等一年。浮山雲时令款，趁鲜喝。" }
  ];

  var BEV_THEMES = ["荔枝冰萃", "白桃乌龙", "芒果椰椰", "多肉葡萄", "栀子奶茶", "青提冰沙", "杨枝甘露", "莓莓拿铁", "桂花酒酿奶", "海盐柠檬茶"];
  var BEV_HOOKS = ["茂名这天热到融化？这杯才是本地人的解暑密码。", "外面奶茶越喝越渴，这杯用真果肉给你降温。", "一杯茶的成本都写脸上，敢不敢看配料表？", "本地人夏天续命，全靠这一口。"];
  var VAR_CATS = {
    "美食": { angles: ["沉浸式吃播", "探店避雷", "懒人食谱"], hooks: ["这道本地人从小吃到大的味道，外地很难复制。", "在家复刻餐厅同款，成本不到三分之\u4e00\u3002"] },
    "穿搭": { angles: ["通勤极简", "小个子显高", "梨形穿搭"], hooks: ["160 微胖女生的一周不重样通勤。", "一件单品三种穿法，钱包松口气。"] },
    "美妆": { angles: ["伪素颜", "持妆攻略", "学生党平价"], hooks: ["夏天脱妆星人自救指南。", "百元内搞定全套，学生党狂喜。"] },
    "家居": { angles: ["租房改造", "收纳神器", "氛围感灯光"], hooks: ["租来的房也要好好住。", "几十块的改动，幸福感翻倍。"] },
    "母婴": { angles: ["带娃好物", "辅食记录", "遛娃攻略"], hooks: ["当妈后才知道的好东西。", "带娃出门不崩溃的清单。"] },
    "数码": { angles: ["平价耳机", "效率软件", "避坑指南"], hooks: ["这预算也能很顶。", "别再交智商税了。"] },
    "旅行": { angles: ["周边游", "citywalk", "穷游攻略"], hooks: [BRAND.city + "周边这些小众去处，本地人都未必全去过。", "周末不用人挤人。"] }
  };
  var XHS_ANGLE = {
    "通勤": { title: "打工人通勤救星👗皮扣丝巾一秒精致", tags: "#丝巾 #通勤穿搭 #早八 #懒人神器" },
    "约会": { title: "约会心机💕皮扣丝巾显脸小小心机", tags: "#丝巾 #约会穿搭 #显脸小 #氛围感" },
    "旅行": { title: "旅行收纳王🧳皮扣丝巾行李减负", tags: "#丝巾 #旅行穿搭 #便携好物 #拍照道具" },
    "送礼": { title: "送闺蜜不出错🎁皮扣丝巾礼盒", tags: "#丝巾 #送礼 #生日礼物 #闺蜜" },
    "性价比": { title: "不到一杯奶茶钱🥤皮扣丝巾真香预警", tags: "#丝巾 #性价比 #平价好物 #学生党" },
    "宝妈": { title: "宝妈出门3分钟👶皮扣丝巾一键精致", tags: "#丝巾 #宝妈穿搭 #省心好物 #带娃也美" }
  };
  var NEWS_LIB = [
    "本地民生：茂名城市更新 / 烟火气街区的新动作，可做成「家门口的变化」系列。",
    "消费趋势：健康化、低糖化饮品走红，浮山雲「真果真奶」正好站上风口。",
    "国货崛起：本地品牌被年轻人重新追捧，适合做「支持本土」情绪内容。",
    "盛夏经济：解暑、降温、夜经济话题高热，饮品内容天然贴合。",
    "短视频风向：真实后厨、原料溯源类内容完播率走高，可复用品牌透明人设。",
    "节日节点：近期节气 / 节日可提前做限定选题，制造仪式感。",
    "职场话题：通勤、早八、打工人的小确幸，易引发共鸣转发。",
    "亲子家庭：暑假亲子出行 / 带娃日常，适合种草家庭友好场景。"
  ];
  var READING_LIB = [
    { t: "《把话说进心里》节选", e: "真正的表达，不是赢过对方，而是让对方愿意听下去。", tip: "跟读重点：停顿与重音——把「愿意听下去」稍微加重，语气立刻不同。" },
    { t: "《浮山雲·一杯茶的修养》", e: "好茶不靠喧哗，靠的是每一道都不偷懒的安静。", tip: "跟读重点：用平缓叙述感念出，练习「不抢拍」的沉稳表达。" },
    { t: "《开口的勇气》", e: "先让别人舒服，自己才有机会被听见。", tip: "跟读重点：前半句轻、后半句稳，练「先抑后扬」的节奏。" },
    { t: "《本地人的浪漫》", e: "茂名的浪漫，是下班路口那杯刚好的甜。", tip: "跟读重点：带一点温度与画面感，适合直播口播热身。" },
    { t: "《简单的话最贵》", e: "少用形容词，多说具体事，别人反而记得住。", tip: "跟读重点：删掉冗余词，练「简洁有力」的表达习惯。" }
  ];
  var VOCAB_LIB = [
    { cat: "开播留人", words: ["家人们先别划走", "今天给你们看个狠货", "刚进来的扣个1", "这款今天只讲三分钟"] },
    { cat: "产品卖点", words: ["真果现切不隔夜", "可溯源纯牛奶", "0 植脂末更放心", "用好料做好茶", "茂名人自己的茶饮"] },
    { cat: "逼单促单", words: ["这款今天限时价", "库存不多手慢无", "第二件半价", "新粉专享价", "现在下单立减"] },
    { cat: "互动拉粉", words: ["想要的扣想要", "点关注不迷路", "评论区告诉我你爱喝哪款", "转发给那个爱喝奶茶的人"] },
    { cat: "信任背书", words: ["配料表敢摊开看", "自家孩子也喝", "街坊复购最多", "明厨亮灶看得见"] }
  ];
  var INSP_SEEDS = [
    "如果浮山雲会说话，它最想对茂名人说的三句话是什么？",
    "把『一杯茶』拍成『一种生活态度』，会是什么画面？",
    "用「降温仪式感」串起一整周的内容，每天一个角度。",
    "如果古茗拍这条，浮山雲怎么拍得比它更懂本地人？",
    "让一位老顾客当一天「品牌主理人」，会讲出什么？",
    "把门店里真实发生的小故事，做成连续剧试试？",
    "如果只用三个镜头讲清楚「放心喝」，你会拍什么？",
    "用『妈妈的味道』做情绪锚点，连接到浮山雲的料。"
  ];

  /* ---------- 生成器 ---------- */
  function genBrandStory(seed) {
    var r = rng((seed || todayStr()) + "brandstory");
    var a = pick(STORY_ANGLES, r);
    var hook = a.hook[Math.floor(r() * a.hook.length)];
    var L = [];
    L.push("【浮山雲品牌故事脚本 · " + a.angle + "】");
    L.push("对标参考：" + a.ref);
    L.push("");
    L.push("🎬 视频结构（建议 45–60s，口播 + 产品特写）：");
    L.push("① 开头钩子（0–5s）：" + hook);
    L.push("② 痛点共鸣（5–15s）：外面很多奶茶香精多、不敢天天喝；" + BRAND.city + "人想要一杯真正放心的茶。");
    L.push("③ 品牌故事讲解（15–40s）：");
    a.beats.forEach(function (b) { L.push("   · " + b); });
    L.push("④ 行动号召（40–60s）：" + a.cta);
    L.push("");
    L.push("💡 拍摄提示：明亮自然光、产品大特写、真人出镜口播更有温度；结尾定位" + BRAND.city + "门店，引导到店。");
    return L.join("\n");
  }

  function genBeverage(theme, platform, seed) {
    platform = platform || "抖音";
    var r = rng((seed != null ? seed : String(Math.random())) + "bev");
    if (!theme) theme = pick(BEV_THEMES, r);
    var hook = pick(BEV_HOOKS, r);
    var breakdown = [
      { label: "选题亮点", text: "把「" + theme + "」做成茂名人夏天的降温符号，自带地域共鸣。" },
      { label: "情绪价值", text: "解暑 + 放心喝，击中「想喝又怕不健康」的纠结。" },
      { label: "拍摄钩子", text: hook },
      { label: "转化点", text: "结尾定位浮山雲门店，引导到店核销。" }
    ];
    var shots = [
      { dur: "0–3s", text: hook },
      { dur: "3–10s", text: "产品大特写：杯壁挂壁、真实果肉、奶盖纹理。" },
      { dur: "10–25s", text: "制作过程：鲜果现切→茶汤现萃→摇杯出杯，快剪带感。" },
      { dur: "25–40s", text: "理念植入：字幕打「用好料，做好茶」，配料表一闪而过。" },
      { dur: "40–55s", text: "真人试喝 + 口播：「茂名人可以放心喝的茶饮，就是这杯。」" }
    ];
    var script = "【" + theme + " · " + platform + " 二创脚本】\n" +
      "0–3s 钩子：" + hook + "\n" +
      "3–10s 痛点：外面奶茶越喝越渴，这杯用真果肉真牛奶给你降温。\n" +
      "10–25s 制作：鲜果现切→茶汤现萃→摇杯，节奏明快。\n" +
      "25–40s 卖点：字幕「" + BRAND.slogan + "」，配料表敢摊开看。\n" +
      "40–55s 号召：来浮山雲，做" + BRAND.city + "人自己放心喝的茶饮。结尾定位门店。";
    return { theme: theme, platform: platform, breakdown: breakdown, shots: shots, script: script, date: todayStr() };
  }

  function genVarious(cat, theme, platform, seed) {
    platform = platform || "抖音"; cat = cat || "美食";
    var r = rng((seed != null ? seed : String(Math.random())) + "var" + cat);
    var info = VAR_CATS[cat] || VAR_CATS["美食"];
    if (!theme) theme = pick(info.angles, r);
    var hook = pick(info.hooks, r);
    var breakdown = [
      { label: "赛道角度", text: cat + "赛道下的「" + theme + "」，差异化在于更真实、更本地。" },
      { label: "情绪价值", text: "解决「想学 / 想省 / 想美」中的一个具体痛点。" },
      { label: "拍摄钩子", text: hook },
      { label: "转化点", text: "评论区引导 + 主页引流，沉淀私域。" }
    ];
    var shots = [
      { dur: "0–3s", text: hook },
      { dur: "3–12s", text: "前情 / 对比：常见误区或尴尬场景。" },
      { dur: "12–30s", text: "实操演示：关键步骤特写，节奏清晰。" },
      { dur: "30–45s", text: "效果展示：前后对比，强化获得感。" },
      { dur: "45–60s", text: "总结 + 号召：关注 / 收藏 / 评论互动。" }
    ];
    var script = "【" + cat + " · " + theme + " · " + platform + " 二创脚本】\n" +
      "0–3s 钩子：" + hook + "\n" +
      "3–12s 痛点：说中观众正在经历的小麻烦。\n" +
      "12–30s 演示：把核心方法拆成可复制的步骤。\n" +
      "30–45s 效果：直观对比，给观众「我也能行」的信心。\n" +
      "45–60s 号召：关注我，每周更新同类型干货。";
    return { theme: theme, platform: platform, cat: cat, breakdown: breakdown, shots: shots, script: script, date: todayStr() };
  }

  function genXHS(angle) {
    var a = XHS_ANGLE[angle] || XHS_ANGLE["通勤"];
    var body = "🌟 最近挖到的宝藏——皮扣更换丝巾！\n" +
      "核心卖点：皮扣设计自由切换，一条丝巾 N 种戴法，一扣多搭不重样。\n" +
      "今天主打「" + angle + "」场景：随手一扣就能出门，" + (angle === "通勤" ? "通勤也能有高级感" : angle === "约会" ? "甜度刚好显脸小" : angle === "旅行" ? "行李减负还好看" : angle === "送礼" ? "礼盒体面又有心意" : angle === "性价比" ? "一杯奶茶钱拿下整周搭配" : "带娃也能美美的") + "。\n" +
      "真丝质感、不挑脸型、好打理，新手也能30秒系好。\n" +
      "👇 同款皮扣丝巾放左下，点收藏，明天继续更每日穿搭灵感～";
    return { angle: angle, title: a.title, body: body, tags: a.tags, date: todayStr() };
  }

  function genNews(seed) {
    var r = rng((seed || todayStr()) + "news");
    var pool = NEWS_LIB.slice();
    var out = ["【今日重点新闻 / 选题方向参考】"];
    for (var i = 0; i < 4; i++) {
      var k = Math.floor(r() * pool.length);
      out.push("· " + pool.splice(k, 1)[0]);
    }
    out.push("");
    out.push("💡 提示：以上为内置选题库按日轮换，非实时抓取；如需真实联网新闻可后续接入 API。");
    return out.join("\n");
  }
  function genReading(seed) {
    var r = rng((seed || todayStr()) + "reading");
    var x = pick(READING_LIB, r);
    return "【今日阅读跟读 · " + x.t + "】\n" + x.e + "\n\n📌 表达技巧：" + x.tip;
  }
  function genVocab(seed) {
    var r = rng((seed || todayStr()) + "vocab");
    var x = pick(VOCAB_LIB, r);
    return "【奶茶直播话术 · " + x.cat + "】\n" + x.words.map(function (w) { return "· " + w; }).join("\n") +
      "\n\n📌 用法：开播前挑 3 句练熟，直播中自然带出，配合「" + BRAND.slogan + "」理念。";
  }
  function genInspSeed(seed) {
    var r = rng((seed || todayStr()) + "inspseed");
    return pick(INSP_SEEDS, r);
  }
  function optimizeIdea(text) {
    var idea = (text || "").trim();
    if (!idea) return "先在上面对话框写下一个你的奇思妙想，再点「优化灵感」～";
    var L = [];
    L.push("🌟 优化版灵感（基于你的点子）");
    L.push("原意：" + idea);
    L.push("");
    L.push("① 核心记忆点：把这句话浓缩成一句口号，让人 3 秒记住。");
    L.push("② 开头钩子（0–3s）：用反差或提问抓住注意力，例如「你绝对想不到…」。");
    L.push("③ 内容结构：痛点 → 你的做法 → 浮山雲理念植入（" + BRAND.slogan + "）→ 证据 → 号召。");
    L.push("④ 可拍画面：产品特写、制作过程、真实顾客反应，三段式快剪。");
    L.push("⑤ 发布建议：标题带地域词「" + BRAND.city + "」+ 情绪词，结尾引导到店/关注。");
    L.push("");
    L.push("—— 可直接改成你的口播稿，继续微调即可。");
    return L.join("\n");
  }

  /* ---------- 默认状态 + 每日重置 ---------- */
  function defaultState() {
    return {
      monthly: [],
      daily: [],
      beverage: { today: null, history: [], notes: [] },
      various: { today: null, history: [], notes: [] },
      xhs: { today: null, history: [], notes: [] },
      study: { duolingoDone: false, exDone: false, duoSeconds: 0, exSeconds: 0, news: "", reading: "", vocab: "", readLog: [], readMed: "ebook" },
      calendar: {},
      review: { weeks: [] },
      insp: { history: [] },
      mood: { history: [] },
      nickname: "",
      dailyTopicHistory: [],
      lastReset: "",
      _dailyModalDate: "",
      _moodDate: ""
    };
  }
  var state = load() || defaultState();
  (function mergeDefaults() {
    var d = defaultState();
    for (var k in d) if (!(k in state)) state[k] = d[k];
  })();

  function resetDaily() {
    var t = todayStr();
    var existing = state.daily.filter(function (x) { return x.preset; }).map(function (x) { return x.text; });
    DAILY_PRESETS.forEach(function (txt) {
      if (existing.indexOf(txt) < 0) state.daily.push({ id: uid(), text: txt, done: false, preset: true });
    });
    state.daily.forEach(function (x) { if (x.preset) x.done = false; });
    state.beverage.today = genBeverage("", "抖音", t); state.beverage.today.date = t;
    state.various.today = genVarious("美食", "", "抖音", t); state.various.today.date = t;
    state.xhs.today = genXHS("通勤"); state.xhs.today.date = t;
    state.study.duoSeconds = 0; state.study.exSeconds = 0; state.study.duolingoDone = false; state.study.exDone = false;
    state.study.news = genNews(t); state.study.reading = genReading(t); state.study.vocab = genVocab(t);
    state.lastReset = t; save();
  }
  if (state.lastReset !== todayStr()) resetDaily();

  /* ---------- 渲染工具 ---------- */
  function el(id) { return document.getElementById(id); }
  function renderProgress() {
    var m = state.monthly, done = m.filter(function (t) { return t.done; }).length;
    el("monthlyProgressText").textContent = "已经完成 " + done + "/" + m.length;
    el("monthlyProgressBar").style.width = (m.length ? (done / m.length * 100) : 0) + "%";
    var d = state.daily, ddone = d.filter(function (t) { return t.done; }).length;
    el("dailyProgressText").textContent = "已经完成 " + ddone + "/" + d.length;
    el("dailyProgressBar").style.width = (d.length ? (ddone / d.length * 100) : 0) + "%";
  }
  function renderTaskList(listId, tasks, opts) {
    opts = opts || {};
    var ul = el(listId); ul.innerHTML = "";
    tasks.forEach(function (t) {
      var li = document.createElement("li");
      li.className = "task-item" + (t.done ? " done" : "");
      li.innerHTML =
        '<div class="cb" data-id="' + t.id + '">' + (t.done ? "✓" : "") + '</div>' +
        '<div class="task-text">' + escapeHtml(t.text) + '</div>' +
        (t.preset ? '<span class="preset-tag">预设</span>' : '') +
        (opts.hideDel ? '' : '<button class="del" data-id="' + t.id + '" title="删除">✕</button>');
      ul.appendChild(li);
    });
  }
  function renderMonthly() { renderTaskList("monthlyList", state.monthly); }
  function renderDaily() { renderTaskList("dailyList", state.daily); renderSideTodo(); }
  function renderSideTodo() {
    var ul = el("sideTodoList"); ul.innerHTML = "";
    var d = state.daily, done = d.filter(function (t) { return t.done; }).length;
    el("sideTodoCount").textContent = done + "/" + d.length;
    d.forEach(function (t) {
      var li = document.createElement("li"); li.className = "side-todo-item" + (t.done ? " done" : "");
      li.innerHTML = '<span class="cb-s">' + (t.done ? "✓" : "") + '</span><span class="txt">' + escapeHtml(t.text) + '</span>';
      li.addEventListener("click", function () { toggleDaily(t.id); });
      ul.appendChild(li);
    });
  }
  function toggleDaily(id) {
    var it = state.daily.find(function (x) { return x.id === id; }); if (!it) return;
    it.done = !it.done; save(); renderDaily(); renderProgress();
  }
  function renderHistory(listId, arr, headFn, bodyFn) {
    var ul = el(listId); ul.innerHTML = "";
    var h = (arr || []).slice().sort(function (a, b) { return b.ts - a.ts; });
    if (!h.length) { ul.innerHTML = '<li class="history-empty">暂无记录，生成或保存后会出现在这里。</li>'; return; }
    h.forEach(function (it) {
      var li = document.createElement("li");
      li.className = "history-item";
      li.innerHTML = '<div class="history-date">' + headFn(it) + '</div><div class="history-body">' + escapeHtml(bodyFn(it)) + '</div>';
      ul.appendChild(li);
    });
  }
  function renderBreakdown(containerId, bd) {
    var box = el(containerId); box.innerHTML = "";
    bd.forEach(function (b) {
      var d = document.createElement("div"); d.className = "bd-item";
      d.innerHTML = '<div class="bd-label">' + b.label + '</div><div class="bd-text">' + escapeHtml(b.text) + '</div>';
      box.appendChild(d);
    });
  }
  function renderShots(containerId, shots) {
    var box = el(containerId); box.innerHTML = "";
    shots.forEach(function (s, i) {
      var d = document.createElement("div"); d.className = "shot";
      d.innerHTML = '<div class="shot-no">' + (i + 1) + '</div><div style="flex:1"><div class="shot-dur">' + s.dur + '</div><div class="shot-text">' + escapeHtml(s.text) + '</div></div>';
      box.appendChild(d);
    });
  }

  /* ---------- 锻炼 / 圆环 / 计时器 ---------- */
  var RING_C = 2 * Math.PI * 52;
  function renderExercise() {
    var ex = state.study;
    var totalSec = 70 * 60, sec = ex.duoSeconds + ex.exSeconds;
    var pct = Math.min(100, Math.round(sec / totalSec * 100));
    el("ringFg").style.strokeDashoffset = (RING_C * (1 - pct / 100)).toFixed(1);
    el("ringPct").textContent = pct + "%";
    el("ringSub").textContent = "今日目标 " + Math.round(sec / 60) + "/70 分钟";
    renderTaskList("exerciseList", [
      { id: "duo", text: "多邻国打卡 10 分钟", done: ex.duolingoDone, preset: true },
      { id: "ex", text: "帕梅拉/运动 60 分钟", done: ex.exDone, preset: true }
    ], { hideDel: true });
  }
  var timer = { total: 3600, remaining: 3600, running: false, interval: null, committed: 3600 };
  function fmt(s) { var m = Math.floor(s / 60), ss = s % 60; return String(m).padStart(2, "0") + ":" + String(ss).padStart(2, "0"); }
  function renderTimer() { el("timerDisplay").textContent = fmt(timer.remaining); }
  function timerBank() {
    var delta = timer.committed - timer.remaining;
    if (delta > 0) { state.study.exSeconds += delta; timer.committed = timer.remaining; save(); }
  }
  function timerStart() {
    if (timer.running) return; timer.running = true;
    timer.interval = setInterval(function () {
      if (timer.remaining > 0) { timer.remaining--; renderTimer(); }
      if (timer.remaining <= 0) {
        clearInterval(timer.interval); timer.running = false; timerBank();
        state.study.exDone = true; save(); renderExercise();
        showModal("运动完成 🍑", "今日 60 分钟运动已打卡完成，圆环进度已更新！");
      }
    }, 1000);
  }
  function timerPause() { if (timer.running) { clearInterval(timer.interval); timer.running = false; timerBank(); renderExercise(); } }
  function timerReset() { clearInterval(timer.interval); timer.running = false; timer.remaining = timer.total; timer.committed = timer.total; renderTimer(); }
  function timerApply() {
    var v = parseInt(el("timerSet").value, 10); if (isNaN(v) || v < 1) v = 60;
    timer.total = v * 60; timer.remaining = timer.total; timer.committed = timer.total;
    clearInterval(timer.interval); timer.running = false; renderTimer();
  }

  /* ---------- 弹窗 ---------- */
  function showModal(title, text) {
    el("modalTitle").textContent = title; el("modalText").textContent = text;
    el("modalMask").classList.add("show");
  }
  el("modalClose").addEventListener("click", function () { el("modalMask").classList.remove("show"); });

  /* ---------- 全屏模式 ---------- */
  var fsMask = el("fsMask"), fsWrap = el("fsWrap"), fsTitleEl = el("fsTitle");
  var fsCard = null, fsParent = null, fsNext = null;
  function injectFsButtons() {
    document.querySelectorAll(".main .card").forEach(function (card) {
      if (card.classList.contains("progress-card")) return;
      if (card.querySelector(".fs-btn")) return;
      var b = document.createElement("button");
      b.className = "fs-btn"; b.type = "button"; b.title = "全屏打开"; b.textContent = "⛶";
      b.addEventListener("click", function (e) { e.stopPropagation(); openFullscreen(card); });
      card.appendChild(b);
    });
  }
  function openFullscreen(card) {
    fsParent = card.parentNode; fsNext = card.nextSibling; fsCard = card;
    var tt = card.querySelector(".card-title"); fsTitleEl.textContent = tt ? tt.textContent : "全屏";
    fsWrap.appendChild(card); fsMask.classList.add("show");
  }
  function closeFullscreen() {
    if (fsCard && fsParent) fsParent.insertBefore(fsCard, fsNext);
    fsMask.classList.remove("show"); fsCard = null;
  }
  el("fsClose").addEventListener("click", closeFullscreen);
  fsMask.addEventListener("click", function (e) { if (e.target === fsMask) closeFullscreen(); });

  /* ---------- 视图切换 ---------- */
  var TITLES = {
    monthly: "每月工作计划", daily: "每日工作计划", recreate: "爆款视频二创", xhs: "小红书每日推文",
    study: "学习计划", calendar: "日历 · 记账", review: "每周直播复盘", insp: "灵感推荐", mood: "心情日记", home: "工作台首页"
  };
  function switchView(name) {
    document.querySelectorAll(".nav-item").forEach(function (b) { b.classList.toggle("active", b.dataset.view === name); });
    document.querySelectorAll(".view").forEach(function (v) { v.classList.toggle("active", v.id === "view-" + name); });
    el("pageTitle").textContent = TITLES[name] || "";
    if (name === "daily") openDaily();
    if (name === "recreate") openRecreate();
    if (name === "xhs") openXHS();
    if (name === "study") openStudy();
    if (name === "calendar") openCalendar();
    if (name === "review") renderReviewHistory();
    if (name === "insp") openInsp();
    if (name === "mood") openMood();
    if (name === "home") openHome();
  }
  document.querySelectorAll(".nav-item").forEach(function (b) {
    b.addEventListener("click", function () { switchView(b.dataset.view); });
  });

  /* ---------- 1. 每月计划 ---------- */
  function addMonthly() {
    var v = el("monthlyAdd").value.trim(); if (!v) return;
    state.monthly.push({ id: uid(), text: v, done: false }); el("monthlyAdd").value = ""; save(); renderMonthly(); renderProgress();
  }
  el("monthlyAddBtn").addEventListener("click", addMonthly);
  el("monthlyAdd").addEventListener("keydown", function (e) { if (e.key === "Enter") addMonthly(); });

  /* ---------- 2. 每日计划（浮山雲选题） ---------- */
  function openDaily() {
    var t = todayStr();
    var saved = state.dailyTopicHistory.filter(function (h) { return h.date === t; }).pop();
    if (saved) el("dailyTopic").value = saved.text;
    else el("dailyTopic").value = genBrandStory(t);
    if (state._dailyModalDate !== t) {
      state._dailyModalDate = t; save();
      showModal("今日浮山雲选题 🍑", "今日还没有记录浮山雲选题灵感，先收下这份对标古茗视频号的品牌故事脚本，按需改写后保存吧～");
    }
    renderHistory("dailyTopicHistory", state.dailyTopicHistory,
      function (it) { return it.date; }, function (it) { return it.text; });
    renderProgress();
  }
  el("dailyTopicSave").addEventListener("click", function () {
    var text = el("dailyTopic").value.trim(); if (!text) { showModal("提示", "内容为空，写点什么再保存～"); return; }
    var t = todayStr(); var idx = state.dailyTopicHistory.map(function (h) { return h.date; }).lastIndexOf(t);
    if (idx >= 0) { state.dailyTopicHistory[idx].text = text; state.dailyTopicHistory[idx].ts = Date.now(); }
    else state.dailyTopicHistory.push({ date: t, text: text, ts: Date.now() });
    save();
    renderHistory("dailyTopicHistory", state.dailyTopicHistory, function (it) { return it.date; }, function (it) { return it.text; });
    showModal("已保存 🍑", "今日浮山雲选题已记录，已加入历史选题列表。");
  });
  function addDaily() {
    var v = el("dailyAdd").value.trim(); if (!v) return;
    state.daily.push({ id: uid(), text: v, done: false, preset: false }); el("dailyAdd").value = ""; save(); renderDaily(); renderProgress();
  }
  el("dailyAddBtn").addEventListener("click", addDaily);
  el("dailyAdd").addEventListener("keydown", function (e) { if (e.key === "Enter") addDaily(); });

  /* ---------- 3. 爆款视频二创 ---------- */
  function fillBeverage(g) {
    state.beverage.today = g; save();
    el("bevTheme").value = g.theme; el("bevPlatform").value = g.platform;
    renderBreakdown("bevBreakdown", g.breakdown); renderShots("bevShots", g.shots); el("bevScript").value = g.script;
    if (!el("bevNote").value.trim()) el("bevNote").value = "今天这条「" + g.theme + "」二创，可加「茂名人夏天的解暑仪式感」角度，结尾定位门店引流。";
  }
  function fillVarious(g) {
    state.various.today = g; save();
    el("varCat").value = g.cat; el("varTheme").value = g.theme; el("varPlatform").value = g.platform;
    renderBreakdown("varBreakdown", g.breakdown); renderShots("varShots", g.shots); el("varScript").value = g.script;
    if (!el("varNote").value.trim()) el("varNote").value = "「" + g.cat + "·" + g.theme + "」可结合浮山雲门店真实场景拍，更接地气。";
  }
  function openRecreate() {
    var t = todayStr();
    if (!state.beverage.today || state.beverage.today.date !== t) { state.beverage.today = genBeverage("", "抖音", t); save(); }
    fillBeverage(state.beverage.today);
    if (!state.various.today || state.various.today.date !== t) { state.various.today = genVarious("美食", "", "抖音", t); save(); }
    fillVarious(state.various.today);
    renderHistory("bevNoteHistory", state.beverage.notes, function (it) { return it.date; }, function (it) { return it.text; });
    renderHistory("varNoteHistory", state.various.notes, function (it) { return it.date; }, function (it) { return it.text; });
  }
  el("bevRegen").addEventListener("click", function () { fillBeverage(genBeverage(el("bevTheme").value.trim(), el("bevPlatform").value, String(Math.random()))); });
  el("bevSave").addEventListener("click", function () { state.beverage.history.push({ date: todayStr(), theme: el("bevTheme").value, content: el("bevScript").value, ts: Date.now() }); save(); showModal("已保存 🍑", "饮品二创方案已另存到历史。"); });
  el("bevNoteSave").addEventListener("click", function () {
    var v = el("bevNote").value.trim(); if (!v) { showModal("提示", "灵感为空～"); return; }
    state.beverage.notes.push({ date: todayStr(), text: v, ts: Date.now() }); save();
    renderHistory("bevNoteHistory", state.beverage.notes, function (it) { return it.date; }, function (it) { return it.text; });
    showModal("已保存 🍑", "今日灵感已记录。");
  });
  el("varRegen").addEventListener("click", function () { fillVarious(genVarious(el("varCat").value, el("varTheme").value.trim(), el("varPlatform").value, String(Math.random()))); });
  el("varSave").addEventListener("click", function () { state.various.history.push({ date: todayStr(), theme: el("varTheme").value, content: el("varScript").value, ts: Date.now() }); save(); showModal("已保存 🍑", "各类二创方案已另存到历史。"); });
  el("varNoteSave").addEventListener("click", function () {
    var v = el("varNote").value.trim(); if (!v) { showModal("提示", "灵感为空～"); return; }
    state.various.notes.push({ date: todayStr(), text: v, ts: Date.now() }); save();
    renderHistory("varNoteHistory", state.various.notes, function (it) { return it.date; }, function (it) { return it.text; });
    showModal("已保存 🍑", "今日灵感已记录。");
  });
  document.querySelectorAll(".tab[data-rec]").forEach(function (b) {
    b.addEventListener("click", function () {
      document.querySelectorAll(".tab[data-rec]").forEach(function (x) { x.classList.toggle("active", x === b); });
      var kind = b.dataset.rec;
      el("rec-bev").style.display = kind === "bev" ? "block" : "none";
      el("rec-var").style.display = kind === "var" ? "block" : "none";
    });
  });

  /* ---------- 4. 小红书 ---------- */
  function fillXHS(g) {
    state.xhs.today = g; save();
    el("xhsAngle").value = g.angle; el("xhsTitle").value = g.title; el("xhsBody").value = g.body; el("xhsTags").value = g.tags;
    if (!el("xhsNote").value.trim()) el("xhsNote").value = "今天这篇可加「门店实拍 + 顾客上身」增强真实感。";
  }
  function openXHS() {
    var t = todayStr();
    if (!state.xhs.today || state.xhs.today.date !== t) { state.xhs.today = genXHS("通勤"); save(); }
    fillXHS(state.xhs.today);
    renderHistory("xhsHistory", state.xhs.history, function (it) { return it.date + " · " + it.angle; }, function (it) { return it.title + "\n" + it.body + "\n" + it.tags; });
    renderHistory("xhsNoteHistory", state.xhs.notes, function (it) { return it.date; }, function (it) { return it.text; });
  }
  el("xhsRegen").addEventListener("click", function () { fillXHS(genXHS(el("xhsAngle").value)); });
  el("xhsSave").addEventListener("click", function () {
    state.xhs.history.push({ date: todayStr(), angle: el("xhsAngle").value, title: el("xhsTitle").value, body: el("xhsBody").value, tags: el("xhsTags").value, ts: Date.now() }); save();
    renderHistory("xhsHistory", state.xhs.history, function (it) { return it.date + " · " + it.angle; }, function (it) { return it.title + "\n" + it.body + "\n" + it.tags; });
    showModal("已保存 🍑", "小红书推文已另存到历史。");
  });
  el("xhsNoteSave").addEventListener("click", function () {
    var v = el("xhsNote").value.trim(); if (!v) { showModal("提示", "灵感为空～"); return; }
    state.xhs.notes.push({ date: todayStr(), text: v, ts: Date.now() }); save();
    renderHistory("xhsNoteHistory", state.xhs.notes, function (it) { return it.date; }, function (it) { return it.text; });
    showModal("已保存 🍑", "今日灵感已记录。");
  });

  /* ---------- 5. 学习计划 ---------- */
  function renderReader() {
    var raw = state.study.reading || genReading(todayStr());
    var title = "今日阅读跟读", body = raw, tip = "";
    var m = raw.match(/【今日阅读跟读 · (.+?)】\n([\s\S]*?)(?:\n\n📌 表达技巧：(.+))?$/);
    if (m) { title = m[1]; body = m[2]; tip = m[3] || ""; }
    el("studyReader").innerHTML =
      '<div class="reader-title">' + escapeHtml(title) + '</div>' +
      '<div class="reader-body">' + escapeHtml(body) + '</div>' +
      (tip ? '<div class="reader-tip">📌 表达技巧：' + escapeHtml(tip) + '</div>' : '');
  }
  function openStudy() {
    renderExercise();
    el("studyNews").textContent = state.study.news || genNews(todayStr());
    el("studyVocab").textContent = state.study.vocab || genVocab(todayStr());
    renderReader();
    renderReadStats();
    renderBookList();
    document.querySelectorAll(".med-btn").forEach(function (b) { b.classList.toggle("active", b.dataset.med === state.study.readMed); });
    readTimerRender();
  }
  function regenReading() {
    state.study.reading = genReading(String(Math.random())); save(); renderReader();
  }
  el("newsRegen").addEventListener("click", function () { state.study.news = genNews(String(Math.random())); save(); el("studyNews").textContent = state.study.news; });
  el("readRegen").addEventListener("click", regenReading);
  el("vocabRegen").addEventListener("click", function () { state.study.vocab = genVocab(String(Math.random())); save(); el("studyVocab").textContent = state.study.vocab; });
  el("timerStart").addEventListener("click", timerStart);
  el("timerPause").addEventListener("click", timerPause);
  el("timerReset").addEventListener("click", timerReset);
  el("timerApply").addEventListener("click", timerApply);

  /* ---------- 阅读模块（图2 风格） ---------- */
  var readTimerInterval = null, readRemaining = 30 * 60;
  function fmtRead(s) { var m = Math.floor(s / 60), ss = s % 60; return String(m).padStart(2, "0") + ":" + String(ss).padStart(2, "0"); }
  function readTimerRender() { var d = el("readTimerDisplay"); if (d) d.textContent = fmtRead(readRemaining); }
  function readTimerStart() {
    if (readTimerInterval) return;
    readTimerInterval = setInterval(function () {
      if (readRemaining > 0) { readRemaining--; readTimerRender(); }
      if (readRemaining <= 0) {
        clearInterval(readTimerInterval); readTimerInterval = null;
        logRead(30);
        showModal("阅读完成 🍑", "今天 30 分钟阅读打卡完成，已记入「连续天数」与「累计分钟」～");
      }
    }, 1000);
  }
  function readTimerPause() { if (readTimerInterval) { clearInterval(readTimerInterval); readTimerInterval = null; } }
  function readTimerReset() { readTimerPause(); readRemaining = 30 * 60; readTimerRender(); }
  el("readStart").addEventListener("click", readTimerStart);
  el("readPause").addEventListener("click", readTimerPause);
  el("readReset").addEventListener("click", readTimerReset);

  function logRead(min) {
    state.study.readLog = state.study.readLog || [];
    state.study.readLog.push({ date: todayStr(), min: min });
    save(); renderReadStats();
  }
  function dsKey(d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  function computeReadStats() {
    var log = state.study.readLog || [];
    var minutes = 0, days = {}, count = log.length;
    log.forEach(function (r) { minutes += r.min; days[r.date] = true; });
    if (count === 0) return { minutes: 0, count: 0, streak: 0 };
    var streak = 0, d = new Date(), guard = 0;
    while (!days[dsKey(d)] && guard < 400) { d.setDate(d.getDate() - 1); guard++; }
    while (days[dsKey(d)] && guard < 4000) { streak++; d.setDate(d.getDate() - 1); guard++; }
    return { minutes: minutes, count: count, streak: streak };
  }
  function renderReadStats() {
    var s = computeReadStats();
    el("readStreak").textContent = s.streak;
    el("readMinutes").textContent = s.minutes;
    el("readCount").textContent = s.count;
  }
  var BOOK_LIB = [
    { t: "如何阅读一本书", d: "读懂一本书的底层方法，跟读练概括与转述。" },
    { t: "卡片笔记法", d: "把阅读变可复用知识卡片，提升表达条理。" },
    { t: "纳瓦尔宝典", d: "关于财富与幸福的清醒思考，金句密度高。" },
    { t: "非暴力沟通", d: "练就平和而有力的表达，适合直播话术借鉴。" },
    { t: "表达力", d: "把想法说清楚、说动人，每日跟读一段见效。" },
    { t: "浮山雲品牌故事集", d: "用本地人视角，讲好自己的茶饮故事。" }
  ];
  function renderBookList() {
    var ul = el("bookList"); if (!ul) return; ul.innerHTML = "";
    BOOK_LIB.forEach(function (b) {
      var div = document.createElement("div");
      div.className = "book-item";
      div.innerHTML = '<div class="book-name">' + escapeHtml(b.t) + '</div><div class="book-desc">' + escapeHtml(b.d) + '</div>';
      div.addEventListener("click", function () {
        el("studyReader").innerHTML =
          '<div class="reader-title">' + escapeHtml(b.t) + '</div>' +
          '<div class="reader-body">' + escapeHtml(b.d) + '\n\n（点击「换一篇」回到系统今日推荐短文）</div>';
      });
      ul.appendChild(div);
    });
  }
  document.querySelectorAll(".med-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      state.study.readMed = b.dataset.med; save();
      document.querySelectorAll(".med-btn").forEach(function (x) { x.classList.toggle("active", x === b); });
    });
  });

  /* ---------- 首页 Dashboard（图1 风格） ---------- */
  var HOME_CARDS = [
    { view: "monthly", t: "每月工作计划", d: "规划每月目标，追踪完成进度" },
    { view: "daily", t: "每日工作计划", d: "浮山雲选题自动更新，每日待办打卡" },
    { view: "recreate", t: "爆款视频二创", d: "灵感拆解+分镜脚本，一键生成可拍脚本" },
    { view: "xhs", t: "小红书每日推文", d: "皮扣丝巾产品推文每日轮换" },
    { view: "study", t: "学习计划", d: "打卡+阅读跟读+直播话术积累" },
    { view: "calendar", t: "日历 · 记账", d: "记录每日笔记，收支一目了然" },
    { view: "review", t: "每周直播复盘", d: "上传数据，智能给出优化建议" },
    { view: "insp", t: "灵感推荐", d: "每日奇思妙想，帮你把点子变方案" },
    { view: "mood", t: "心情日记", d: "记录每一天的心情与故事" }
  ];
  function openHome() {
    var hi = state.nickname ? ("你好，" + state.nickname + "～") : "桃子好 🍑";
    el("homeHi").innerHTML = hi + ' <span class="home-edit" id="homeEditName" title="点击修改昵称">✎</span>';
    var d = new Date(), wk = ["日", "一", "二", "三", "四", "五", "六"][d.getDay()];
    el("homeDate").textContent = d.getFullYear() + " 年 " + (d.getMonth() + 1) + " 月 " + d.getDate() + " 日 · 周" + wk;
    el("homeAvatar").innerHTML = peachSVG();
    bindEditName();
    renderOverview();
    renderHomeCards();
  }
  function renderHomeCards() {
    var grid = el("homeGrid"); if (!grid) return; grid.innerHTML = "";
    HOME_CARDS.forEach(function (c) {
      var card = document.createElement("div");
      card.className = "home-card";
      card.innerHTML =
        '<div class="home-card-ico">' + peachSVG() + '</div>' +
        '<div class="home-card-title">' + escapeHtml(c.t) + '</div>' +
        '<div class="home-card-desc">' + escapeHtml(c.d) + '</div>' +
        '<div class="home-card-go">进入 →</div>';
      card.addEventListener("click", function () { switchView(c.view); });
      grid.appendChild(card);
    });
  }
  function renderOverview() {
    var done = 0, total = (state.daily || []).length;
    (state.daily || []).forEach(function (t) { if (t.done) done++; });
    el("ovTodo").textContent = done + "/" + total;
    var todays = (state.mood.history || []).filter(function (m) { return m.date === todayStr(); });
    el("ovMood").textContent = todays.length ? (todays[0].emoji || "🙂") : "—";
    var y = new Date().getFullYear(), m = new Date().getMonth() + 1, sum = 0;
    var prefix = y + "-" + String(m).padStart(2, "0");
    for (var k in (state.calendar || {})) {
      if (k.indexOf(prefix) === 0) {
        (state.calendar[k].records || []).forEach(function (r) { sum += (r.type === "in" ? r.amount : -r.amount); });
      }
    }
    el("ovBalance").textContent = (sum < 0 ? "-¥" : "¥") + Math.abs(sum);
    document.querySelectorAll(".ov-card").forEach(function (c) { c.onclick = function () { switchView(c.dataset.go); }; });
  }
  function bindEditName() {
    var e = el("homeEditName");
    if (e) e.onclick = function () {
      var n = prompt("设置你的昵称（用于首页问候）：", state.nickname || "");
      if (n !== null) { state.nickname = n.trim(); save(); openHome(); }
    };
  }

  /* ---------- 6. 日历 · 记账 ---------- */
  var calYear, calMonth, selDate;
  function calKey(y, m, d) { return y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0"); }
  function renderCalendar() {
    var d = new Date(); if (calYear == null) { calYear = d.getFullYear(); calMonth = d.getMonth(); }
    var first = new Date(calYear, calMonth, 1), startDay = (first.getDay() + 6) % 7;
    var days = new Date(calYear, calMonth + 1, 0).getDate();
    el("calTitle").textContent = calYear + " 年 " + (calMonth + 1) + " 月";
    var grid = el("calGrid"); grid.innerHTML = "";
    for (var i = 0; i < startDay; i++) { var e = document.createElement("div"); e.className = "cal-cell empty"; grid.appendChild(e); }
    for (var day = 1; day <= days; day++) {
      var key = calKey(calYear, calMonth, day);
      var rec = state.calendar[key];
      var cell = document.createElement("div"); cell.className = "cal-cell";
      var hasData = rec && (rec.note || (rec.records && rec.records.length));
      var out = 0; if (rec && rec.records) rec.records.forEach(function (r) { if (r.type === "out") out += r.amount; });
      cell.innerHTML = '<div class="cal-day">' + day + '</div>' +
        (hasData ? '<div class="cal-dot"></div>' : '') +
        (out ? '<div class="cal-amt out">-¥' + out + '</div>' : '');
      if (key === todayStr()) cell.className += " today";
      if (key === selDate) cell.className += " sel";
      (function (k) { cell.addEventListener("click", function () { selDate = k; renderCalendar(); openDay(k); }); })(key);
      grid.appendChild(cell);
    }
    // 本月合计
    var mi = 0, mo = 0;
    Object.keys(state.calendar).forEach(function (k) {
      if (k.indexOf(calKey(calYear, calMonth, 1).slice(0, 7)) !== 0) return;
      (state.calendar[k].records || []).forEach(function (r) { if (r.type === "in") mi += r.amount; else mo += r.amount; });
    });
    var bal = mi - mo;
    el("calMonthSum").innerHTML = '<span style="color:var(--green-600)">收入 ¥' + mi + '</span> · <span style="color:var(--pink-600)">支出 ¥' + mo + '</span> · 结余 ¥' + bal;
  }
  function openDay(key) {
    selDate = key; el("calSelDate").textContent = key;
    var rec = state.calendar[key] || { note: "", records: [] };
    el("calNote").value = rec.note || "";
    renderBk(key);
  }
  function renderBk(key) {
    var rec = state.calendar[key] || { note: "", records: [] };
    var ins = 0, out = 0; (rec.records || []).forEach(function (r) { if (r.type === "in") ins += r.amount; else out += r.amount; });
    el("bkSummary").innerHTML = '<span class="in">收入 ¥' + ins + '</span><span class="out">支出 ¥' + out + '</span><span>结余 ¥' + (ins - out) + '</span>';
    var ul = el("bkList"); ul.innerHTML = "";
    (rec.records || []).slice().reverse().forEach(function (r, i) {
      var li = document.createElement("li"); li.className = "bk-item";
      li.innerHTML = '<span class="bk-tag ' + r.type + '">' + (r.type === "in" ? "收入" : "支出") + '</span>' +
        '<span class="bk-cat">' + escapeHtml(r.cat) + '</span>' +
        '<span class="bk-note">' + escapeHtml(r.note || "") + '</span>' +
        '<span class="bk-amt ' + r.type + '">' + (r.type === "in" ? "+" : "-") + "¥" + r.amount + '</span>' +
        '<button class="bk-del" data-i="' + i + '">✕</button>';
      ul.appendChild(li);
    });
    ul.querySelectorAll(".bk-del").forEach(function (b) {
      b.addEventListener("click", function () {
        var i = parseInt(b.dataset.i, 10);
        var arr = (state.calendar[key].records || []); arr.splice(arr.length - 1 - i, 1); save(); renderBk(key); renderCalendar();
      });
    });
  }
  el("calNoteSave").addEventListener("click", function () {
    if (!selDate) { showModal("提示", "请先选择一个日期～"); return; }
    if (!state.calendar[selDate]) state.calendar[selDate] = { note: "", records: [] };
    state.calendar[selDate].note = el("calNote").value; save(); renderCalendar();
    showModal("已保存 🍑", selDate + " 的笔记已保存。");
  });
  el("bkAdd").addEventListener("click", function () {
    if (!selDate) { showModal("提示", "请先选择一个日期～"); return; }
    var amt = parseFloat(el("bkAmount").value); if (isNaN(amt) || amt <= 0) { showModal("提示", "请输入有效金额～"); return; }
    if (!state.calendar[selDate]) state.calendar[selDate] = { note: "", records: [] };
    state.calendar[selDate].records.push({ type: el("bkType").value, amount: amt, cat: el("bkCat").value, note: el("bkNote").value.trim() });
    el("bkAmount").value = ""; el("bkNote").value = ""; save(); renderBk(selDate); renderCalendar();
  });
  el("calPrev").addEventListener("click", function () { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } renderCalendar(); });
  el("calNext").addEventListener("click", function () { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } renderCalendar(); });
  el("calToday").addEventListener("click", function () { var d = new Date(); calYear = d.getFullYear(); calMonth = d.getMonth(); selDate = todayStr(); renderCalendar(); openDay(selDate); });
  function openCalendar() { renderCalendar(); if (!selDate) { selDate = todayStr(); } openDay(selDate); }

  /* ---------- 7. 每周直播复盘 ---------- */
  function genReview() {
    var sessions = parseFloat(el("revSessions").value) || 0;
    var view = parseFloat(el("revView").value) || 0;
    var gmv = parseFloat(el("revGmv").value) || 0;
    var aov = parseFloat(el("revAov").value) || 0;
    var fans = parseFloat(el("revFans").value) || 0;
    var stay = parseFloat(el("revStay").value) || 0;
    var main = el("revMain").value.trim() || "（未填）";
    var note = el("revNote").value.trim();
    var L = [];
    L.push("【本周直播复盘 · " + (el("revWeek").value.trim() || todayStr()) + "】");
    L.push("📊 数据快照：场次 " + sessions + " · 场均观看 " + view + " · GMV ¥" + gmv + " · 客单价 ¥" + aov + " · 新增粉丝 " + fans + " · 平均停留 " + stay + "s");
    L.push("主推产品：" + main);
    L.push("");
    L.push("🔧 需要优化的地方：");
    if (view && view < 800) L.push("· 开场留人弱：前 3 秒缺少强钩子，建议用「福利/反差/提问」抓住划走的手指。");
    if (aov && aov < 50) L.push("· 客单价偏低：建议推组合装 / 第二件半价 / 满减，拉高连带。");
    if (stay && stay < 90) L.push("· 平均停留短：福利节奏太散，建议每 8–10 分钟一个互动点（扣字/抽奖/限时价）。");
    if (fans && fans < 200) L.push("· 转粉弱：缺少明确的关注引导话术，建议在每个卖点后都带「点关注不迷路」。");
    if (sessions && gmv && (gmv / sessions) < 5000) L.push("· 单场产出偏低：逼单节奏可加密，用「库存不多/限时价」制造紧迫感。");
    L.push("· 内容对标：参考古茗视频号「真实后厨 + 原料溯源」的信任感打法，把浮山雲「" + BRAND.slogan + "」理念前置。");
    if (note) L.push("· 你提到的问题：「" + note + "」→ 建议拆成 1 个本周小目标，先改最影响转化的一项。");
    L.push("");
    L.push("🎯 本周一个小目标：挑上面最影响转化的一条，做成可执行清单，下周对比数据。");
    return L.join("\n");
  }
  el("revGen").addEventListener("click", function () {
    var txt = genReview(); el("revResult").textContent = txt; el("revResultCard").style.display = "block";
  });
  el("revSave").addEventListener("click", function () {
    state.review.weeks.push({
      date: todayStr(), week: el("revWeek").value.trim() || todayStr(),
      data: { sessions: el("revSessions").value, view: el("revView").value, gmv: el("revGmv").value, aov: el("revAov").value, fans: el("revFans").value, stay: el("revStay").value, main: el("revMain").value, note: el("revNote").value },
      result: el("revResult").textContent, ts: Date.now()
    });
    save(); renderReviewHistory(); showModal("已保存 🍑", "本周复盘已存档。");
  });
  function renderReviewHistory() {
    renderHistory("revHistory", state.review.weeks,
      function (it) { return it.date + " · " + it.week; }, function (it) { return it.result; });
  }

  /* ---------- 8. 灵感推荐 ---------- */
  function openInsp() {
    el("inspSeed").textContent = genInspSeed(todayStr());
    renderHistory("inspHistory", state.insp.history,
      function (it) { return it.date; }, function (it) { return (it.idea ? "原意：" + it.idea + "\n" : "") + (it.optimized || ""); });
  }
  el("inspOptimize").addEventListener("click", function () {
    var idea = el("inspIdea").value.trim();
    if (!idea) { showModal("提示", "先写下你的奇思妙想，再点优化～"); return; }
    var opt = optimizeIdea(idea); el("inspResult").value = opt;
  });
  el("inspSave").addEventListener("click", function () {
    var idea = el("inspIdea").value.trim(), opt = el("inspResult").value.trim();
    if (!idea && !opt) { showModal("提示", "没有可保存的内容～"); return; }
    state.insp.history.push({ date: todayStr(), idea: idea, optimized: opt, ts: Date.now() }); save();
    renderHistory("inspHistory", state.insp.history, function (it) { return it.date; }, function (it) { return (it.idea ? "原意：" + it.idea + "\n" : "") + (it.optimized || ""); });
    showModal("已保存 🍑", "这条灵感已存入历史。");
  });

  /* ---------- 9. 心情日记 ---------- */
  var MOODS = ["😊", "😍", "🥰", "😎", "🤔", "😴", "😢", "😡", "😇", "🥳", "😌", "🙃"];
  var selMood = "";
  function renderMoodEmojis() {
    var box = el("moodEmojis"); box.innerHTML = "";
    MOODS.forEach(function (m) {
      var b = document.createElement("button"); b.className = "mood-emoji"; b.textContent = m; b.type = "button";
      b.addEventListener("click", function () {
        selMood = m; document.querySelectorAll(".mood-emoji").forEach(function (x) { x.classList.toggle("active", x === b); });
      });
      box.appendChild(b);
    });
  }
  function openMood() {
    var t = todayStr();
    var rec = state.mood.history.filter(function (h) { return h.date === t; }).pop();
    selMood = rec ? rec.emoji : "";
    el("moodText").value = rec ? rec.text : "";
    document.querySelectorAll(".mood-emoji").forEach(function (x) { x.classList.toggle("active", x.textContent === selMood); });
    renderHistory("moodHistory", state.mood.history,
      function (it) { return it.date + (it.emoji ? "  " + it.emoji : ""); }, function (it) { return it.text || "（只选了表情）"; });
  }
  el("moodSave").addEventListener("click", function () {
    var t = todayStr(), text = el("moodText").value.trim();
    if (!selMood && !text) { showModal("提示", "选个表情或写点什么吧～"); return; }
    var idx = state.mood.history.map(function (h) { return h.date; }).lastIndexOf(t);
    if (idx >= 0) { state.mood.history[idx].emoji = selMood; state.mood.history[idx].text = text; state.mood.history[idx].ts = Date.now(); }
    else state.mood.history.push({ date: t, emoji: selMood, text: text, ts: Date.now() });
    save();
    renderHistory("moodHistory", state.mood.history, function (it) { return it.date + (it.emoji ? "  " + it.emoji : ""); }, function (it) { return it.text || "（只选了表情）"; });
    showModal("已保存 🍑", "今日心情已记录。");
  });

  /* ---------- 全局：任务勾选 / 删除 委托 ---------- */
  document.querySelector(".main").addEventListener("click", function (e) {
    var cb = e.target.closest(".cb"); if (cb) {
      var id = cb.dataset.id, item = null, list = null;
      item = state.monthly.find(function (x) { return x.id === id; }); if (item) list = state.monthly;
      if (!item) { item = state.daily.find(function (x) { return x.id === id; }); if (item) list = state.daily; }
      if (item) {
        item.done = !item.done;
        save(); renderMonthly(); renderDaily(); renderProgress(); return;
      }
      if (cb.closest("#exerciseList")) {
        var eid = cb.dataset.id;
        if (eid === "duo") { state.study.duolingoDone = !state.study.duolingoDone; if (state.study.duolingoDone && state.study.duoSeconds < 600) state.study.duoSeconds = 10 * 60; }
        if (eid === "ex") { state.study.exDone = !state.study.exDone; if (state.study.exDone && state.study.exSeconds < 3600) state.study.exSeconds = 60 * 60; }
        save(); renderExercise(); renderProgress(); return;
      }
    }
    var del = e.target.closest(".task-item .del"); if (del) {
      var did = del.dataset.id;
      state.monthly = state.monthly.filter(function (x) { return x.id !== did; });
      state.daily = state.daily.filter(function (x) { return x.id !== did; });
      save(); renderMonthly(); renderDaily(); renderProgress(); return;
    }
  });

  /* ---------- 数据备份（导出 / 导入） ---------- */
  function exportBackup() {
    var raw = localStorage.getItem(STORE);
    if (!raw) { showModal("提示", "当前没有可备份的数据～"); return; }
    try {
      var blob = new Blob([raw], { type: "application/json" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
      a.href = url;
      a.download = "peach-workbench-" + d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + ".json";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      showModal("已导出 🍑", "备份文件已下载到你的设备，请妥善保存。换手机、清缓存或用云端版时，可用「导入备份」一键恢复。");
    } catch (e) { showModal("提示", "导出失败：" + e.message); }
  }
  function importBackup(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var obj = JSON.parse(reader.result);
        if (!obj || typeof obj !== "object" || !("monthly" in obj) || !("calendar" in obj)) {
          showModal("提示", "文件格式不对，不是桃子工作台的备份～"); return;
        }
        localStorage.setItem(STORE, JSON.stringify(obj));
        showModal("已导入 🍑", "备份已恢复，页面即将刷新。");
        setTimeout(function () { location.reload(); }, 900);
      } catch (e) { showModal("提示", "导入失败：文件无法解析（" + e.message + "）"); }
    };
    reader.onerror = function () { showModal("提示", "读取文件失败～"); };
    reader.readAsText(file);
  }
  el("btnExport").addEventListener("click", exportBackup);
  el("btnImport").addEventListener("click", function () { el("importFile").click(); });
  el("importFile").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0];
    if (f) importBackup(f);
    e.target.value = "";
  });

  /* ---------- 初始化 ---------- */
  el("todayChip").textContent = "今天 " + todayStr().slice(5);
  renderMoodEmojis();
  renderMonthly(); renderDaily(); renderProgress();
  injectFsButtons();
  el("sideTodoTitle").addEventListener("click", function () { switchView("daily"); });
  var brandEl = document.querySelector(".brand");
  if (brandEl) brandEl.addEventListener("click", function () { switchView("home"); });
  switchView("home");
})();
