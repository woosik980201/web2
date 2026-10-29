
import React from "react";

function WarningBanner(props) {
    if (!props.warning) {
        return null;
    } else {
        return (
            <div className="warning-banner">
                ⚠️ 경고! 주의가 필요합니다.
            </div>
        );
    }
}

export default WarningBanner;
