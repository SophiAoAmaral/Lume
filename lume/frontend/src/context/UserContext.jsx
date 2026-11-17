import { createContext, useContext, useState, useEffect } from "react";


const UserContext = createContext(null);
export function UserProvider({children}){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        async function checkSession() {
            try{
                const response = await fetch("/api/auth/me",{
                    method: 'GET',
                    credentials: 'include'
                });
                if(!response.ok){
                setUser(null);
                return;
            }
            const data = await response.json()

           console.log("Usuário recuperado:", data);

           setUser(data.user);
            }catch(err){
                console.error("Erro ao verificar sessão:", error);
                setUser(null);
            }finally{
                setLoading(false);
            }
            
        }

        checkSession()
    },[])

    return(
        <UserContext.Provider value={{user, setUser, loading}}>
            {children}
        </UserContext.Provider>
    );
}


export function useUser(){
    return useContext(UserContext)
}