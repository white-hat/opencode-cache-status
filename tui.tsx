import { Plugin } from "@opencode/plugin/tui"
import { Show } from "solid-js"
import { cacheHitLabel } from "./cache-hit"

export default Plugin.define({
  id: "white-hat.opencode-cache-status",
  setup(context) {
    return context.ui.slot({
      append: "prompt.footer.status",
      render: (props) => {
        const label = () => props.sessionID
          ? cacheHitLabel(context.data.session.message.list(props.sessionID))
          : undefined
        return (
          <Show when={label()}>
            {(value) => <text fg={context.theme.text.muted}>{value()}</text>}
          </Show>
        )
      },
    })
  },
})
