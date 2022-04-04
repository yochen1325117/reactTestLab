import './style.scss';

function MagicBlock({ status, context, disable, blockStyle, clickFunction }) {
    return (
        <div className="MagicBlock" style={blockStyle} onClick={disable ? () => {} : clickFunction }>
            { context }
        </div>
    );
}

export default MagicBlock;