const exampleResult = [
    {
        "number": 0,
        "path": "/dev/input/js0",
        "name": "Logitech Gamepad F310",
        "numButtons": 11,
        "numAxes": 8,
        "buttonMap": {
            "0": "BtnA",
            "1": "BtnB",
            "2": "BtnX",
            "3": "BtnY",
            "4": "BtnTL",
            "5": "BtnTR",
            "6": "BtnSelect",
            "7": "BtnStart",
            "8": "BtnMode",
            "9": "BtnThumbL",
            "10": "BtnThumbR"
        },
        "axisMap": {
            "0": "X",
            "1": "Y",
            "2": "Z",
            "3": "Rx",
            "4": "Ry",
            "5": "Rz",
            "6": "Hat0X",
            "7": "Hat0Y"
        }
    },
    {
        "number": 1,
        "path": "/dev/input/js1",
        "name": "Sony Navigation Controller",
        "numButtons": 12,
        "numAxes": 3,
        "buttonMap": {
            "0": "BtnA",
            "1": "BtnB",
            "2": "BtnX",
            "3": "BtnY",
            "4": "BtnTL",
            "5": "BtnTL2",
            "6": "BtnMode",
            "7": "BtnThumbL"
        },
        "axisMap": {
            "0": "X",
            "1": "Y",
            "2": "Z"
        }
    }
];

export const listJoysticks = async (): Promise<{
    number: number;
    path: string;
    name: string;
    numButtons: number;
    numAxes: number;
    buttonMap: Record<string, string>;
    axisMap: Record<string, string>;
}[]> => {
    return exampleResult;
};