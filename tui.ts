import { Plugin } from "@opencode/plugin/tui"
import { createComponent, createElement, spread } from "@opentui/solid"
import { Show } from "solid-js"
import { cacheHitLabel } from "./cache-hit"

export default Plugin.define({
  id: "white-hat.opencode-cache-status",
  setup(context) {
    return context.ui.slot({
      append: "prompt.footer.status",
      // Use the host's renderer directly so installation doesn't need a JSX build.
      render: (props) => createComponent(Show, {
        get when() {
          return props.sessionID
            ? cacheHitLabel(context.data.session.message.list(props.sessionID))
            : undefined
        },
        children: (value: () => string) => {
          const text = createElement("text")
          spread(text, {
            get fg() { return context.theme.text.muted },
            get children() { return value() },
          })
          return text
        },
      }),
    })
  },
})
