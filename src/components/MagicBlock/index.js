import './style.scss';

function MagicBlock({ status, context, disable, blockStyle, contextStyle, clickFunction }) {
    return (
        <div className="MagicBlock" style={{ ...blockStyle }} onClick={disable && clickFunction}>
            <p style={{ ...contextStyle }}>{ context }</p>
        </div>
    );
}

export default MagicBlock;