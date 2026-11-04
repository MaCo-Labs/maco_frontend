import type { CSSProperties } from "react";

/**
 * An optional single choice as a cluster of chips: the chosen one swells and
 * pushes its neighbours aside (all CSS `:has()`, styles.css). Native radios, so
 * FormData, `form.reset()`, arrow keys and a disabled parent fieldset just work.
 */
export function ChoiceChips({
  legend,
  name,
  options,
  className,
  style,
}: {
  legend: string;
  name: string;
  options: readonly { value: string; label: string }[];
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <fieldset className={`choice-chips ${className ?? ""}`} style={style}>
      <legend className="label">{legend}</legend>
      <div className="choice-chips-row">
        {options.map((option) => (
          <label key={option.value} className="choice-chip">
            <input type="radio" name={name} value={option.value} />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
