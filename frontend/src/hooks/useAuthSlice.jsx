import {useSelector} from "react-redux";
const useAuthState = () =>{
    const authState = useSelector((state)=>state.auth);
    return authState;
}
export default useAuthState;