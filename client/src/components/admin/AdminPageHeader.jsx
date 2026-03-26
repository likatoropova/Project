import React from 'react';

const AdminPageHeader = ({ title, buttonText, onButtonClick, buttonDisabled = false }) => {
    return (
        <div className="content_header">
            <h1>{title}</h1>
            {buttonText && onButtonClick && (
                <button onClick={onButtonClick} disabled={buttonDisabled}>
                    {buttonText}
                </button>
            )}
        </div>
    );
};

export default AdminPageHeader;
