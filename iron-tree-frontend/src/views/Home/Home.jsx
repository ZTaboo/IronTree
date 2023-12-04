import {useNavigate} from "react-router-dom";

export default function Home() {
    const navigate = useNavigate()
    return (
        <div>
            this is home
            <button onClick={() => {
                navigate('/login')
            }}>to login</button>
        </div>
    )
}