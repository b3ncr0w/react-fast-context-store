import { SettingsType } from "react-fast-context-store";
import { useFastStore } from "../store";

export const Component = ({
  selector,
  settings,
}: {
  selector?: string;
  settings?: SettingsType;
}) => {
  const [getStoreData] = useFastStore();

  return (
    <div
      style={{
        padding: "10px",
        border: "1px dashed #eee5",
      }}
    >
      <span style={{ color: "green" }}>{selector}</span>
      <pre>{JSON.stringify(getStoreData(selector, settings), null, 4)}</pre>
    </div>
  );
};
