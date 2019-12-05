var inputMin = 137683;
var inputMax = 596253;

var acceptable = 0;
for (let i = inputMin; i <= inputMax; i++)
{
    let str = i.toString();

    let double = 0;
    let decreasing = 0;
    for (let j = 0; j < str.length - 1; j++)
    {
        if (str[j] === str[j+1]) {
            double = 1;
        }

        if (parseInt(str[j]) > parseInt(str[j+1])) {
            decreasing = 1;
        }
    }

    if (double === 1 && decreasing === 0)
    {
        acceptable++;
    }
}

console.log(acceptable);

// part 2
acceptable = 0;
for (let i = inputMin; i <= inputMax; i++)
{
    let str = i.toString();

    let double = 0;
    let decreasing = 0;
    let largeGroup = 0;

    for (let j = 0; j < str.length - 1; j++)
    {
        let count = 0;
        if (double === 0)
        {
            while (str[j] === str[j+1]) {
                count++;
                double = 1;
                if (count > 1)
                {
                    double = 0;
                }
                j++;
            }
        }

        if (parseInt(str[j]) > parseInt(str[j+1])) {
            decreasing = 1;
        }
    }

    if (double === 1 && decreasing === 0)
    {
        acceptable++;
    }
}

console.log(acceptable);

//1065 too low