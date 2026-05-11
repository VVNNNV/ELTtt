export interface SiteItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon?: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  parentId?: string;
  children?: Category[];
}

export const categories: Category[] = [
  {
    id: "recommend",
    name: "推荐",
    icon: "Star",
    children: [
      { id: "daily", name: "每日必看", icon: "Flame" },
      { id: "tools-hot", name: "热门工具", icon: "Zap" },
    ],
  },
  {
    id: "design",
    name: "设计",
    icon: "Palette",
    children: [
      { id: "design-tool", name: "设计工具", icon: "Pen" },
      { id: "design-resource", name: "设计素材", icon: "Image" },
      { id: "icon-font", name: "图标字体", icon: "Type" },
    ],
  },
  {
    id: "dev",
    name: "开发",
    icon: "Code",
    children: [
      { id: "dev-tool", name: "开发工具", icon: "Wrench" },
      { id: "dev-doc", name: "文档教程", icon: "BookOpen" },
      { id: "dev-community", name: "社区论坛", icon: "Users" },
    ],
  },
  {
    id: "product",
    name: "产品",
    icon: "Package",
    children: [
      { id: "product-tool", name: "产品工具", icon: "BarChart" },
      { id: "product-resource", name: "产品资源", icon: "Layers" },
    ],
  },
  {
    id: "media",
    name: "媒体",
    icon: "Monitor",
    children: [
      { id: "video", name: "视频平台", icon: "Play" },
      { id: "music", name: "音乐电台", icon: "Music" },
    ],
  },
  { id: "ai", name: "人工智能", icon: "Brain" },
  { id: "other", name: "其他资源", icon: "FolderOpen" },
];

export const sites: SiteItem[] = [
  // 每日必看
  { id: "1", title: "GitHub", url: "https://github.com", description: "全球最大的代码托管平台和开发者社区", icon: "https://github.githubassets.com/favicons/favicon.svg", categoryId: "daily" },
  { id: "2", title: "Product Hunt", url: "https://www.producthunt.com", description: "发现最新最好的科技产品", icon: "https://ph-static.imgix.net/ph-ios-icon.png", categoryId: "daily" },
  { id: "3", title: "Hacker News", url: "https://news.ycombinator.com", description: "Y Combinator 旗下的科技新闻社区", icon: "https://news.ycombinator.com/favicon.ico", categoryId: "daily" },
  { id: "4", title: "少数派", url: "https://sspai.com", description: "高质量的数字消费指南", icon: "https://cdn-static.sspai.com/favicon/sspai.ico", categoryId: "daily" },
  { id: "5", title: "V2EX", url: "https://www.v2ex.com", description: "创意工作者们的社区", icon: "https://www.v2ex.com/static/icon-192.png", categoryId: "daily" },
  { id: "6", title: "36氪", url: "https://36kr.com", description: "让创业更简单", icon: "https://36kr.com/favicon.ico", categoryId: "daily" },

  // 热门工具
  { id: "7", title: "Notion", url: "https://www.notion.so", description: "一站式工作空间，笔记、文档、项目管理", icon: "https://www.notion.so/images/favicon.ico", categoryId: "tools-hot" },
  { id: "8", title: "Figma", url: "https://www.figma.com", description: "协作式界面设计工具", icon: "https://static.figma.com/app/icon/1/favicon.png", categoryId: "tools-hot" },
  { id: "9", title: "Vercel", url: "https://vercel.com", description: "前端部署和托管平台", icon: "https://assets.vercel.com/image/upload/front/favicon/vercel/favicon.ico", categoryId: "tools-hot" },
  { id: "10", title: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI 推出的 AI 对话助手", icon: "https://chat.openai.com/favicon.ico", categoryId: "tools-hot" },

  // 设计工具
  { id: "11", title: "Sketch", url: "https://www.sketch.com", description: "专业的矢量图形设计工具", icon: "https://www.sketch.com/favicon.ico", categoryId: "design-tool" },
  { id: "12", title: "Adobe XD", url: "https://www.adobe.com/products/xd.html", description: "Adobe 出品的 UI/UX 设计工具", icon: "https://www.adobe.com/favicon.ico", categoryId: "design-tool" },
  { id: "13", title: "Canva", url: "https://www.canva.com", description: "在线平面设计工具，简单易用", icon: "https://static.canva.com/static/images/favicon.ico", categoryId: "design-tool" },
  { id: "14", title: "即时设计", url: "https://js.design", description: "国产在线 UI 设计工具", icon: "https://js.design/favicon.ico", categoryId: "design-tool" },

  // 设计素材
  { id: "15", title: "Unsplash", url: "https://unsplash.com", description: "高质量免费图片素材库", icon: "https://unsplash.com/favicon.ico", categoryId: "design-resource" },
  { id: "16", title: "Dribbble", url: "https://dribbble.com", description: "设计师作品展示和灵感平台", icon: "https://cdn.dribbble.com/assets/favicon-b38525134603b9513174ec887944bde1a869eb6a9f4fc2a0ae8cf6f50a7df8b6.ico", categoryId: "design-resource" },
  { id: "17", title: "Behance", url: "https://www.behance.net", description: "Adobe 旗下的创意作品展示平台", icon: "https://www.behance.net/favicon.ico", categoryId: "design-resource" },
  { id: "18", title: "Pexels", url: "https://www.pexels.com", description: "免费高清图片和视频素材", icon: "https://www.pexels.com/favicon.ico", categoryId: "design-resource" },

  // 图标字体
  { id: "19", title: "Iconfont", url: "https://www.iconfont.cn", description: "阿里巴巴矢量图标库", icon: "https://img.alicdn.com/imgextra/i4/O1CN01EYTRnJ297D6vehehJ_!!6000000008020-55-tps-64-64.svg", categoryId: "icon-font" },
  { id: "20", title: "Font Awesome", url: "https://fontawesome.com", description: "最流行的图标字体库", icon: "https://fontawesome.com/favicon.ico", categoryId: "icon-font" },
  { id: "21", title: "Lucide Icons", url: "https://lucide.dev", description: "美观一致的开源图标集", icon: "https://lucide.dev/favicon.ico", categoryId: "icon-font" },

  // 开发工具
  { id: "22", title: "VS Code", url: "https://code.visualstudio.com", description: "微软出品的轻量级代码编辑器", icon: "https://code.visualstudio.com/favicon.ico", categoryId: "dev-tool" },
  { id: "23", title: "CodePen", url: "https://codepen.io", description: "在线前端代码编辑和分享平台", icon: "https://cpwebassets.codepen.io/assets/favicon/favicon-aec34940fbc1a6e787974dcd360f2c6b63348d4b1f4e06c77743096d55480f33.ico", categoryId: "dev-tool" },
  { id: "24", title: "StackBlitz", url: "https://stackblitz.com", description: "在线全栈开发 IDE", icon: "https://stackblitz.com/favicon.ico", categoryId: "dev-tool" },
  { id: "25", title: "Postman", url: "https://www.postman.com", description: "API 开发和测试工具", icon: "https://www.postman.com/favicon.ico", categoryId: "dev-tool" },

  // 文档教程
  { id: "26", title: "MDN Web Docs", url: "https://developer.mozilla.org", description: "Mozilla 官方 Web 技术文档", icon: "https://developer.mozilla.org/favicon.ico", categoryId: "dev-doc" },
  { id: "27", title: "React 官方文档", url: "https://react.dev", description: "React 官方学习文档", icon: "https://react.dev/favicon.ico", categoryId: "dev-doc" },
  { id: "28", title: "菜鸟教程", url: "https://www.runoob.com", description: "学的不仅是技术，更是梦想！", icon: "https://www.runoob.com/favicon.ico", categoryId: "dev-doc" },

  // 社区论坛
  { id: "29", title: "Stack Overflow", url: "https://stackoverflow.com", description: "全球最大的技术问答社区", icon: "https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico", categoryId: "dev-community" },
  { id: "30", title: "掘金", url: "https://juejin.cn", description: "开发者的技术社区", icon: "https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png", categoryId: "dev-community" },
  { id: "31", title: "SegmentFault", url: "https://segmentfault.com", description: "中文开发者技术社区", icon: "https://segmentfault.com/favicon.ico", categoryId: "dev-community" },

  // 产品工具
  { id: "32", title: "ProcessOn", url: "https://www.processon.com", description: "在线流程图和思维导图工具", icon: "https://www.processon.com/favicon.ico", categoryId: "product-tool" },
  { id: "33", title: "墨刀", url: "https://modao.cc", description: "在线产品原型设计工具", icon: "https://modao.cc/favicon.ico", categoryId: "product-tool" },
  { id: "34", title: "Axure", url: "https://www.axure.com", description: "专业的原型设计工具", icon: "https://www.axure.com/favicon.ico", categoryId: "product-tool" },

  // 产品资源
  { id: "35", title: "人人都是产品经理", url: "https://www.woshipm.com", description: "产品经理学习与交流平台", icon: "https://www.woshipm.com/favicon.ico", categoryId: "product-resource" },
  { id: "36", title: "ProductBoard", url: "https://www.productboard.com", description: "产品管理和路线图工具", icon: "https://www.productboard.com/favicon.ico", categoryId: "product-resource" },

  // 视频平台
  { id: "37", title: "Bilibili", url: "https://www.bilibili.com", description: "国内知名的弹幕视频网站", icon: "https://www.bilibili.com/favicon.ico", categoryId: "video" },
  { id: "38", title: "YouTube", url: "https://www.youtube.com", description: "全球最大的视频分享网站", icon: "https://www.youtube.com/favicon.ico", categoryId: "video" },

  // 音乐电台
  { id: "39", title: "网易云音乐", url: "https://music.163.com", description: "音乐社交平台，发现好音乐", icon: "https://music.163.com/favicon.ico", categoryId: "music" },
  { id: "40", title: "Spotify", url: "https://www.spotify.com", description: "全球最大的音乐流媒体平台", icon: "https://www.spotify.com/favicon.ico", categoryId: "music" },

  // 人工智能
  { id: "41", title: "ChatGPT", url: "https://chat.openai.com", description: "OpenAI 推出的 AI 对话助手", icon: "https://chat.openai.com/favicon.ico", categoryId: "ai" },
  { id: "42", title: "Midjourney", url: "https://www.midjourney.com", description: "AI 图像生成工具", icon: "https://www.midjourney.com/favicon.ico", categoryId: "ai" },
  { id: "43", title: "Claude", url: "https://claude.ai", description: "Anthropic 推出的 AI 助手", icon: "https://claude.ai/favicon.ico", categoryId: "ai" },
  { id: "44", title: "通义千问", url: "https://tongyi.aliyun.com", description: "阿里巴巴推出的大语言模型", icon: "https://tongyi.aliyun.com/favicon.ico", categoryId: "ai" },

  // 其他资源
  { id: "45", title: "TinyPNG", url: "https://tinypng.com", description: "智能 PNG/JPEG 图片压缩工具", icon: "https://tinypng.com/images/favicon.ico", categoryId: "other" },
  { id: "46", title: "Carbon", url: "https://carbon.now.sh", description: "创建漂亮的代码截图", icon: "https://carbon.now.sh/favicon.ico", categoryId: "other" },
  { id: "47", title: "Excalidraw", url: "https://excalidraw.com", description: "手绘风格的在线白板工具", icon: "https://excalidraw.com/favicon.ico", categoryId: "other" },
];

export function getAllSubCategories(): Category[] {
  const result: Category[] = [];
  categories.forEach((cat) => {
    if (cat.children) {
      cat.children.forEach((child) => result.push(child));
    } else {
      result.push(cat);
    }
  });
  return result;
}

export function getSitesByCategory(categoryId: string): SiteItem[] {
  return sites.filter((s) => s.categoryId === categoryId);
}

export function getSiteById(id: string): SiteItem | undefined {
  return sites.find((s) => s.id === id);
}

export function searchSites(query: string): SiteItem[] {
  const q = query.toLowerCase();
  return sites.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.url.toLowerCase().includes(q)
  );
}
