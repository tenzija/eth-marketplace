import { toast } from "react-toastify"

export const withToast = (promise) => {
    toast.promise(
        promise,
        {
            pending: {
            render(){
                return (
                    <div 
                        // className="p-6 py-2 rounded-md text-white bg-green-500"
                    >
                            Your <b className="font-semibold">transaction</b> is being <b>processed</b>
                    </div>
                )
            },
            icon: true,
            position: toast.POSITION.TOP_LEFT
            },
            success: {
            render({data}){
                return (
                    <div>
                        <p
                            className="font-semibold"    
                        >
                            Tx: {data.transactionHash.slice(0, 20)}...
                        </p>
                        <p>
                            Has been succesfuly processed
                        </p>
                        <a
                            href={`https://ropsten.etherscan.io/tx/${data.transactionHash}`}
                            target="_blank"
                        >
                            <i 
                                className="text-green-500 underline"
                            >
                                See Tx Details
                            </i>
                        </a>
                    </div>
                )
            },
            // other options
            icon: "🟢",
            },
            error: {
            render({data}){
                return <div className="font-semibold">{data.message ?? "Transaction has failed"}</div>
                }
            }
        },
        {
            closeButton: true
        },
    )
}