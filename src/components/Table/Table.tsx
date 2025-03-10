import cx from "classnames";
import { PropsWithChildren, forwardRef } from "react";

interface TableTdThProps extends PropsWithChildren, React.HTMLProps<HTMLTableCellElement> {
  padding?: Padding;
}

export function Table(props: PropsWithChildren & React.HTMLProps<HTMLTableElement>) {
  return <div className={cx("App-box w-full rounded-8 bg-main-bg text-main-text", props.className)}><table {...props} className='w-full'  /></div>;
}
export function TableTh(props: TableTdThProps) {
  const { padding = "all", ...rest } = props;

  return (
    <th
      {...rest}
      className={cx("text-left font-normal uppercase last-of-type:text-right", props.className, {
        "px-4 py-12 first-of-type:pl-16 last-of-type:pr-16": padding === "all",
        "px-4 first-of-type:pl-16 last-of-type:pr-16": padding === "horizontal",
        "py-12": padding === "vertical",
        "p-0": padding === "none",
      })}
    />
  );
}

export function TableTheadTr({
  bordered,
  ...props
}: PropsWithChildren<{ bordered?: boolean }> & React.HTMLProps<HTMLTableRowElement>) {
  return (
    <tr
      {...props}
      className={cx(props.className, {
        "border-b border-main-border": bordered,
      })}
    />
  );
}

export const TableTr = forwardRef<
  HTMLTableRowElement,
  PropsWithChildren<{ hoverable?: boolean; bordered?: boolean }> & React.HTMLProps<HTMLTableRowElement>
>(function TableTrInternal({ hoverable = true, bordered = true, className, ...props }, ref) {
  return (
    <tr
      {...props}
      ref={ref}
      className={cx(className, {
        "border-b border-main-border last-of-type:border-b-0": bordered,
        "": hoverable,
        "cursor-pointer": !!props.onClick,
      })}
    />
  );
});

type Padding = "all" | "horizontal" | "vertical" | "none";

export function TableTd(props: TableTdThProps) {
  const { padding = "all", ...rest } = props;
  return (
    <td
      {...rest}
      className={cx("last-of-type:[&:not(:first-of-type)]:text-right", props.className, {
        "px-4 py-12 first-of-type:pl-16 last-of-type:pr-16": padding === "all",
        "px-4 first-of-type:pl-16 last-of-type:pr-16": padding === "horizontal",
        "py-12": padding === "vertical",
        "p-0": padding === "none",
      })}
    />
  );
}
