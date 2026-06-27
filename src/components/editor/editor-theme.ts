const theme = {
  rules: [
      { background: "1a1b1e", token: "" },
      // Comments
      { foreground: "6b6e76", token: "comment" },
      { foreground: "6b6e76", token: "punctuation.definition.comment" },
      // Variables / text
      { foreground: "e1e2e7", token: "variable" },
      { foreground: "e1e2e7", token: "meta.group.braces.curly.js constant.other.object.key.js string.unquoted.label.js" },
      // Keywords
      { foreground: "a78bfa", token: "keyword" },
      { foreground: "a78bfa", token: "storage.type" },
      { foreground: "a78bfa", token: "storage.modifier" },
      // Operators / punctuation / html
      { foreground: "94a3b8", token: "keyword.operator" },
      { foreground: "94a3b8", token: "constant.other.color" },
      { foreground: "94a3b8", token: "punctuation" },
      { foreground: "94a3b8", token: "meta.tag" },
      { foreground: "94a3b8", token: "punctuation.definition.tag" },
      { foreground: "94a3b8", token: "punctuation.separator.inheritance.php" },
      { foreground: "94a3b8", token: "punctuation.definition.tag.html" },
      { foreground: "94a3b8", token: "punctuation.definition.tag.begin.html" },
      { foreground: "94a3b8", token: "punctuation.definition.tag.end.html" },
      { foreground: "94a3b8", token: "punctuation.section.embedded" },
      { foreground: "94a3b8", token: "keyword.other.template" },
      { foreground: "94a3b8", token: "keyword.other.substitution" },
      // HTML tags
      { foreground: "f87171", token: "entity.name.tag" },
      { foreground: "f87171", token: "meta.tag.sgml" },
      { foreground: "f87171", token: "markup.deleted.git_gutter" },
      // Functions
      { foreground: "60a5fa", token: "entity.name.function" },
      { foreground: "60a5fa", token: "meta.function-call" },
      { foreground: "60a5fa", token: "variable.function" },
      { foreground: "60a5fa", token: "support.function" },
      { foreground: "60a5fa", token: "keyword.other.special-method" },
      { foreground: "60a5fa", token: "meta.block-level" },
      { foreground: "60a5fa", fontStyle: "italic", token: "tag.decorator.js entity.name.tag.js" },
      { foreground: "60a5fa", fontStyle: "italic", token: "tag.decorator.js punctuation.definition.tag.js" },
      // Links / special variables
      { foreground: "fca5a5", token: "support.other.variable" },
      { foreground: "fca5a5", token: "string.other.link" },
      // Numbers / constants
      { foreground: "fb923c", token: "constant.numeric" },
      { foreground: "fb923c", token: "constant.language" },
      { foreground: "fb923c", token: "support.constant" },
      { foreground: "fb923c", token: "constant.character" },
      { foreground: "fb923c", token: "variable.parameter" },
      { foreground: "fb923c", token: "keyword.other.unit" },
      // Strings (green)
      { foreground: "86efac", fontStyle: "normal", token: "string" },
      { foreground: "86efac", fontStyle: "normal", token: "constant.other.symbol" },
      { foreground: "86efac", fontStyle: "normal", token: "constant.other.key" },
      { foreground: "86efac", fontStyle: "normal", token: "entity.other.inherited-class" },
      { foreground: "86efac", fontStyle: "normal", token: "markup.heading" },
      { foreground: "86efac", fontStyle: "normal", token: "markup.inserted.git_gutter" },
      { foreground: "86efac", fontStyle: "normal", token: "meta.group.braces.curly constant.other.object.key.js string.unquoted.label.js" },
      // Classes / types (warm yellow)
      { foreground: "fbbf24", token: "entity.name.class" },
      { foreground: "fbbf24", token: "entity.name.type.class" },
      { foreground: "fbbf24", token: "support.type" },
      { foreground: "fbbf24", token: "support.class" },
      { foreground: "fbbf24", token: "support.orther.namespace.use.php" },
      { foreground: "fbbf24", token: "meta.use.php" },
      { foreground: "fbbf24", token: "support.other.namespace.php" },
      { foreground: "fbbf24", token: "markup.changed.git_gutter" },
      // Imports / language vars
      { foreground: "fca5a5", token: "entity.name.module.js" },
      { foreground: "fca5a5", token: "variable.import.parameter.js" },
      { foreground: "fca5a5", token: "variable.other.class.js" },
      { foreground: "fca5a5", fontStyle: "italic", token: "variable.language" },
      // Constructor / class method
      { foreground: "e2e8f0", token: "meta.class-method.js entity.name.function.js" },
      { foreground: "e2e8f0", token: "variable.function.constructor" },
      { foreground: "e2e8f0", token: "meta.class.js meta.class.property.js meta.method.js string.unquoted.js entity.name.function.js" },
      // Attribute names
      { foreground: "c084fc", token: "entity.other.attribute-name" },
      // Git gutter
      { foreground: "86efac", token: "markup.inserted" },
      { foreground: "f87171", token: "markup.deleted" },
      { foreground: "c084fc", token: "markup.changed" },
      // Regex / escapes
      { foreground: "94a3b8", token: "string.regexp" },
      { foreground: "94a3b8", token: "constant.character.escape" },
      // Links
      { fontStyle: "underline", token: "*url*" },
      { fontStyle: "underline", token: "*link*" },
      { fontStyle: "underline", token: "*uri*" },
      // Find in files
      { foreground: "b0a18e", token: "constant.numeric.line-number.find-in-files - match" },
      { foreground: "86efac", token: "entity.name.filename.find-in-files" },
      // JS labels
      { foreground: "fca5a5", fontStyle: "italic", token: "source.js constant.other.object.key.js string.unquoted.label.js" },
      // JSON key coloring (top-level → deep nested, cycling hues)
      { foreground: "fbbf24", token: "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "fbbf24", token: "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "a78bfa", token: "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "a78bfa", token: "source.json meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "e2e8f0", token: "source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "e2e8f0", token: "source.json meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "60a5fa", token: "source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "60a5fa", token: "source.json meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "b0a18e", token: "source.json meta meta meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "b0a18e", token: "source.json meta meta meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "f87171", token: "source.json meta meta meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "f87171", token: "source.json meta meta meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "fb923c", token: "source.json meta meta meta meta.structure.dictionary.json string.quoted.double.json - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "fb923c", token: "source.json meta meta meta meta.structure.dictionary.json punctuation.definition.string - meta meta meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "fbbf24", token: "source.json meta meta.structure.dictionary.json string.quoted.double.json - meta meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "fbbf24", token: "source.json meta meta.structure.dictionary.json punctuation.definition.string - meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
      { foreground: "a78bfa", token: "source.json meta.structure.dictionary.json string.quoted.double.json - meta.structure.dictionary.json meta.structure.dictionary.value.json string.quoted.double.json" },
      { foreground: "a78bfa", token: "source.json meta.structure.dictionary.json punctuation.definition.string - meta meta.structure.dictionary.json meta.structure.dictionary.value.json punctuation.definition.string" },
  ],
  colors: {
      "editor.foreground": "#e1e2e7",
      "editor.background": "#141517",
      "editor.selectionBackground": "#2a2b3066",
      "editor.lineHighlightBackground": "#2a2b3033",
      "editorCursor.foreground": "#a0a0aa",
      "editorWhitespace.foreground": "#2a2b30",
      "editorIndentGuide.background": "#2a2b3066",
      "editorIndentGuide.activeBackground": "#60a5fa66",
      "editorLineNumber.foreground": "#4a4b50",
      "editorLineNumber.activeForeground": "#a0a0aa",
  },
};

export default theme;