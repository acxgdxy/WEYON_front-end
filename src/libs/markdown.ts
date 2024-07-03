import MarkdownIt from "markdown-it";
// import MarkdownItSub from "markdown-it-sub"
// import MarkdownItAbbr from "markdown-it-abbr"
// import MarkdownItContainer from "markdown-it-container"
// import MarkdownItDeflist from "markdown-it-deflist"
// import MarkdownItEmoji from "markdown-it-emoji"
// import MarkdownItFootnote from "markdown-it-footnote"
// import MarkdownItIns from "markdown-it-ins"
// import MarkdownItExternal from "markdown-it-katex-external"
// import MarkdownItMark from "markdown-it-mark"
// import MarkdownItSup from "markdown-it-sup"
// import MarkdownItLists from "markdown-it-task-lists"
import highlight from "highlight.js";




export const md = new MarkdownIt({
    linkify: true,
    typographer: true,
    breaks: true,
    langPrefix: "language-",
    // 代码高亮
    highlight: function (str, lang) {
        if (lang && highlight.getLanguage(lang)) {
            try {
                return (
                    '<pre class="hljs"><code>' +
                    highlight.highlight(lang, str, true).value +
                    "</code></pre>"
                );
            } catch (__) {
            }
        }
        return "";
    },
})
// .use(MarkdownItSub)
// .use(MarkdownItAbbr)
// .use(MarkdownItContainer)
// .use(MarkdownItDeflist)
// .use(MarkdownItEmoji)
// .use(MarkdownItFootnote)
// .use(MarkdownItIns)
// .use(MarkdownItExternal)
// .use(MarkdownItMark )
// .use(MarkdownItSup)
// .use(MarkdownItLists);

//     .use(require("markdown-it-sub"))
//     .use(require("markdown-it-sup"))
//     .use(require("markdown-it-mark"))
//     .use(require("markdown-it-abbr"))
//     .use(require("markdown-it-container"))
//     .use(require("markdown-it-deflist"))
//     .use(require("markdown-it-emoji"))
//     .use(require("markdown-it-footnote"))
//     .use(require("markdown-it-ins"))
//     .use(require("markdown-it-katex-external"))
//     .use(require("markdown-it-task-lists"));


