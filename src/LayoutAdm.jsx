import { Outlet } from "react-router-dom"
import NavigationAdm from "./components/AdminNavigation"

const LayoutAdm = () => {
    return (
        <div>
            <NavigationAdm/>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}

export default LayoutAdm;