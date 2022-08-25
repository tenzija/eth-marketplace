import Link from "next/link"
import React from "react"
import { useRouter } from "next/router"

export default function ActiveLink({children, activeLinkClass, ...props}) {
    const { pathname } = useRouter()

    let className = children.props.className || ""

    if (pathname === props.href) {
        className = `${className} ${activeLinkClass ? activeLinkClass : "px-3 py-3 text-white bg-green-500 rounded-md"}`
    }

    return (
        <Link {...props}>
            {
                React.cloneElement(children, {className})
            }
        </Link>
    )
}