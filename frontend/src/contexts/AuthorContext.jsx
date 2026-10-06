import { useState } from "react";
import { UserContext } from "./userContext";

const initialUser = {
  firstName: "",
  lastName: "",
  email: "",
  profileImageUrl: "",
  role: "",
};

function AuthorContext({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const storedData = localStorage.getItem("currentUser");

    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch {
        return initialUser;
      }
    }

    return initialUser;
  });

  const updateCurrentUser = (user) => {
    setCurrentUser(user);

    if (user?.email) {
      localStorage.setItem("currentUser", JSON.stringify(user));
    } else {
      localStorage.removeItem("currentUser");
    }
  };

  return (
    <UserContext.Provider
      value={{ currentUser, setCurrentUser: updateCurrentUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default AuthorContext;