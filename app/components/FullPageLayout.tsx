import type { ReactElement} from "react"

type Props = {
    children: ReactElement | ReactElement[],
    wrapperClasses: string
}

export default function FullPageLayout({children, wrapperClasses}:Props) {
    return (
        <section className={`w-full h-screen overflow-auto ${wrapperClasses}`}>
            <div className="max-w-6xl mx-auto h-auto">
            {children}
            </div>
        </section>
    )
}