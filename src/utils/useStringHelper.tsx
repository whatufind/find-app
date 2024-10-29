type useStringHelperReturn = {
    capitalFirstLetter: (text: string) => string;
    camelize: (text: string) => string;
};

export const useStringHelper = (): useStringHelperReturn => {
    const capitalFirstLetter = (text: string): string => {
        return text.charAt(0).toUpperCase() + text.substring(1);
    };

    const camelize = (str: string): string => {
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
            if (+match === 0) { return ''; } // or if (/\s+/.test(match)) for white spaces
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        });
    };

    return {
        capitalFirstLetter,
        camelize,
    };
};
