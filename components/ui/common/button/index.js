export default function Button({
    children, 
    className = "text-white bg-green-500 hover:bg-green-600",
    variant = "green",
    hoverable = true,
    ...rest
}) {

    const variants = {
        white: `text-black bg-white`,
        green: `text-white bg-green-600 ${hoverable && "hover:bg-green-700"}`,
        purple: `text-white bg-indigo-600 ${hoverable && "hover:bg-indigo-700"}`,
        red: `text-white bg-red-600 ${hoverable && "hover:bg-red-700"}`,
        lightPurple: `text-indigo-700 bg-indigo-100 ${hoverable && "hover:bg-indigo-200"}`,
    }
    
    return (
        <button
            {...rest}
            className={`px-8 py-3 border rounded-md p-2 text-base font-medium ${className}`}>
            {children}
        </button>
    )
}

