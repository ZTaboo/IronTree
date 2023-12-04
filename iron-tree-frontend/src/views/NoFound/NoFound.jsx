import './index.less'

export default function NoFound() {
    return (
        <div className={'no-found bg-[#CEDFEF] dark:bg-[#010101]'}>
            <div className="loader JS_on">
                <span className="binary"></span>
                <span className="binary"></span>
                <span className="getting-there text-[#4472CA] dark:text-[#fff]">404未找到...</span>
            </div>
        </div>
    )
}