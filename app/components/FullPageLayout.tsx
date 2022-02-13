import type { ReactElement } from "react";

type Props = {
  children: ReactElement | ReactElement[];
  wrapperClasses?: string;
};

export default function FullPageLayout({
  children,
  wrapperClasses = "bg-indigo-900 text-indigo-200",
}: Props) {
  return (
    <section
      className={`w-full h-screen overflow-auto px-4 xl:px-0 ${wrapperClasses}`}
    >
      <div className="max-w-6xl mx-auto h-auto">{children}</div>
    </section>
  );
}
