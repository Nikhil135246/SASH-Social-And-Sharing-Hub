import { Children, createContext, useState,useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 1. State Management:
    //    - Create a state variable 'user' using useState hook. 
    //    - Initially, 'user' is set to null (no user is logged in).
    const [user, setUser] = useState(null);
  
    // 2. Function to update the user state with the entire authUser object.
    const setAuth = (authUser) => {
      setUser(authUser);
    };
  
    // 3. Function to update the user state with new data.
    //    - Use spread syntax to keep existing properties of 'user' while 
    //      overriding them with the provided 'userData'.
    const setUserData = (userData) => {
      setUser({ ...user, ...userData });
    };
  
    // 4. Render the AuthContext.Provider component.
    //    - Pass the 'user', 'setAuth', and 'setUserData' as values to child components.
    return (
      <AuthContext.Provider value={{ user, setAuth, setUserData }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  // 5. Create a custom hook to access the AuthContext.
  //    - Use useContext hook to get the values provided by AuthProvider.
  export const useAuth = () => useContext(AuthContext);