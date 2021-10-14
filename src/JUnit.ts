
export function assertEquals(one: any, two: any, three: any): boolean {
    let flag: any = one;
    let src: any = two;
    let tar: any = three;
    switch (arguments.length) {
        case 2: {
            flag = '';
            src = one;
            tar = two;
            break;
        }
        case 3: {
            break;
        }
        default:
            console.log('junit error call');
            return false;
    }

    if (src == tar) {
        console.log(`junit ${flag}: yes`);
        return true;
    }

    console.log(`junit ${flag}: no:`);
    console.log('source=' + src);
    console.log('target=' + tar);
    return false;
}
