import { useContext } from "react";

import './style.scss';
import { ThemeContext } from '../../AppRouter';

function SetimeModal() {
    const contextType = useContext(ThemeContext);
    if (!contextType.modalData.show) {
        return null;
    }
    return (
        <div className="SetimeModal" >{ contextType.modalData.context }</div>
    );
}

export default SetimeModal;