import { Settings } from "react-fast-context-store";
import { useFastStore } from "../store";
import { useEffect, useRef } from "react";

export const Component = ({
  selector,
  settings,
  children,
}: {
  selector?: string;
  settings?: Settings;
  children?: React.ReactNode;
}) => {
  const [getData] = useFastStore();
  const data = getData(selector, settings);
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.borderColor = "cyan";
      const timeout = setTimeout(() => {
        if (divRef.current) {
          divRef.current.style.borderColor = "#eee5";
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  });

  return (
    <div
      ref={divRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "5px",
        padding: "10px",
        border: "1px dashed #eee5",
        transition: "background-color 0.2s ease-in-out",
        fontSize: "11px",
        fontFamily: "monospace",
      }}
    >
      {selector && <span style={{ color: "lightgreen" }}>selector: ("{selector}")</span>}
      {settings?.observedSelectors && <span style={{ color: "lightblue" }}>observedSelectors: {JSON.stringify(settings?.observedSelectors)}</span>}
      {settings?.ignoredSelectors && <span style={{ color: "orange" }}>ignoredSelectors: {JSON.stringify(settings?.ignoredSelectors)}</span>}
      {children}
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  );
};
