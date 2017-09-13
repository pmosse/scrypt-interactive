const fs = require('fs')
const tape = require('tape')
const spawn = require('tape-spawn')
const Web3 = require('web3')

// these can be generated by running the compile function
var runnerCode = "0x6060604052341561000f57600080fd5b5b6116138061001f6000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063194e10ce1461003e575b600080fd5b341561004957600080fd5b6100a2600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001909190505061014e565b6040518083600460200280838360005b838110156100ce5780820151818401525b6020810190506100b2565b5050505090500180602001828103825283818151815260200191508051906020019080838360005b838110156101125780820151818401525b6020810190506100f6565b50505050905090810190601f16801561013f5780820380516001836020036101000a031916815260200191505b50935050505060405180910390f35b6101566114f4565b61015e61151c565b610166611530565b61016e611561565b6000610179876102c2565b9250600090505b856001820110156101a4576101968382846102ed565b5b8080600101915050610180565b600182600001901515908115158152505060008614156101c3576101f0565b6108008610156101dd576101d88387846102ed565b6101ef565b6101e68361045d565b82602001819052505b5b8260000151600060048110151561020357fe5b602002015185600060048110151561021757fe5b6020020181815250508260000151600160048110151561023357fe5b602002015185600160048110151561024757fe5b6020020181815250508260000151600260048110151561026357fe5b602002015185600260048110151561027757fe5b6020020181815250508260000151600360048110151561029357fe5b60200201518560036004811015156102a757fe5b602002018181525050816020015193505b5050509250929050565b6102ca611530565b6102d682836080610499565b81600001819052506102e781610639565b5b919050565b60008060008060006108008710151561030557600080fd5b60008714156103245761031f8860008a6000015189610667565b610452565b6104008710156103585761033b8860000151610725565b886000018190525061035388888a6000015189610667565b610451565b6104007c01000000000000000000000000000000000000000000000000000000008960000151600260048110151561038c57fe5b602002015181151561039a57fe5b048115156103a457fe5b0694506103b28886886107e5565b9350935093509350610448608060405190810160405280868b6000015160006004811015156103dd57fe5b6020020151188152602001858b6000015160016004811015156103fc57fe5b6020020151188152602001848b60000151600260048110151561041b57fe5b6020020151188152602001838b60000151600360048110151561043a57fe5b602002015118815250610725565b88600001819052505b5b5b5050505050505050565b61046561151c565b61046d61151c565b61047a836000015161084e565b905061049061048b82836020610499565b61084e565b91505b50919050565b6104a16114f4565b6104a961151c565b600060048551016040518059106104bd5750595b908082528060200260200182016040525b509150600090505b84518110156105845784818151811015156104ed57fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f010000000000000000000000000000000000000000000000000000000000000002828281518110151561054657fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053505b80806001019150506104d6565b600090505b8360208202101561062f57600181017f0100000000000000000000000000000000000000000000000000000000000000028260018451038151811015156105cc57fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535061060686836108f2565b60019004838260048110151561061857fe5b6020020181815250505b8080600101915050610589565b5b50509392505050565b6110006040518059106106495750595b908082528060200260200182016040525b5081604001819052505b50565b6000610671611583565b6000806000806104008910151561068757600080fd5b886004029550896040015194508760006004811015156106a357fe5b60200201518860016004811015156106b757fe5b60200201518960026004811015156106cb57fe5b60200201518a60036004811015156106df57fe5b6020020151935093509350935060208601955083868601526020860195508286860152602086019550818686015260208601955080868601525b50505050505050505050565b61072d6114f4565b60008060008085600060048110151561074257fe5b602002015186600160048110151561075657fe5b602002015187600260048110151561076a57fe5b602002015188600360048110151561077e57fe5b60200201519350935093509350610799828518828518610c7b565b80945081955050506107af828518828518610c7b565b80925081935050506080604051908101604052808581526020018481526020018381526020018281525094505b50505050919050565b60008060008060006107f5611583565b6104008810151561080557600080fd5b876004029150886040015190506020820191508181015195506020820191508181015194506020820191508181015193506020820191508181015192505b505093509350935093565b61085661151c565b600060806040518059106108675750595b908082528060200260200182016040525b50915082600060048110151561088a57fe5b602002015190508060208301528260016004811015156108a657fe5b602002015190508060408301528260026004811015156108c257fe5b602002015190508060608301528260036004811015156108de57fe5b602002015190508060808301525b50919050565b600080600080600080604088511115610999576002886000604051602001526040518082805190602001908083835b60208310151561094757805182525b602082019150602081019050602083039250610921565b6001836020036101000a03801982511681845116808217855250505050505090500191505060206040518083038160008661646e5a03f1151561098957600080fd5b5050604051805190509450610b06565b600092505b8751831080156109ae5750602083105b15610a4f5782601f0360080260020a88848151811015156109cb57fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900402600102851794505b828060010193505061099e565b602092505b875183108015610a645750604083105b15610b055782603f0360080260020a8884815181101515610a8157fe5b9060200101517f010000000000000000000000000000000000000000000000000000000000000090047f0100000000000000000000000000000000000000000000000000000000000000027f0100000000000000000000000000000000000000000000000000000000000000900402600102841793505b8280600101935050610a54565b5b7f363636363636363636363636363636363636363636363636363636363636363660010291507f5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c5c6001029050600285821885831860028886188887188c600060405160200152604051808460001916600019168152602001836000191660001916815260200182805190602001908083835b602083101515610bbe57805182525b602082019150602081019050602083039250610b98565b6001836020036101000a038019825116818451168082178552505050505050905001935050505060206040518083038160008661646e5a03f11515610c0257600080fd5b50506040518051905060006040516020015260405180846000191660001916815260200183600019166000191681526020018260001916600019168152602001935050505060206040518083038160008661646e5a03f11515610c6457600080fd5b50506040518051905095505b505050505092915050565b6000806000806000869250859150600090505b6008811015610cc757610ca18383610d3e565b8093508194505050610cb383836110ff565b80935081945050505b600281019050610c8e565b600090505b6008811015610d3357610cf9610ce28483611406565b610cec8984611406565b0163ffffffff1682611429565b85179450610d21610d0a8383611406565b610d148884611406565b0163ffffffff1682611429565b841793505b8080600101915050610ccc565b5b5050509250929050565b600080600080600080610dd37c010000000000000000000000000000000000000000000000000000000089811515610d7257fe5b046c010000000000000000000000008a811515610d8b57fe5b047c01000000000000000000000000000000000000000000000000000000008a811515610db457fe5b046c010000000000000000000000008b811515610dcd57fe5b04611443565b93509350935093506c010000000000000000000000008363ffffffff16027c01000000000000000000000000000000000000000000000000000000008563ffffffff16021795506c010000000000000000000000008163ffffffff16027c01000000000000000000000000000000000000000000000000000000008363ffffffff1602179450610ed56801000000000000000089811515610e7057fe5b04780100000000000000000000000000000000000000000000000089811515610e9557fe5b04680100000000000000008a811515610eaa57fe5b0478010000000000000000000000000000000000000000000000008c811515610ecf57fe5b04611443565b8094508195508296508397505050505078010000000000000000000000000000000000000000000000008163ffffffff1602680100000000000000008563ffffffff16021786179550680100000000000000008263ffffffff160278010000000000000000000000000000000000000000000000008463ffffffff16021785179450610fc37401000000000000000000000000000000000000000088811515610f7a57fe5b0464010000000089811515610f8b57fe5b04740100000000000000000000000000000000000000008b811515610fac57fe5b046401000000008c811515610fbd57fe5b04611443565b809450819550829650839750505050506401000000008163ffffffff1602740100000000000000000000000000000000000000008363ffffffff160217861795506401000000008363ffffffff1602740100000000000000000000000000000000000000008563ffffffff1602178517945061109160018881151561104457fe5b047001000000000000000000000000000000008a81151561106157fe5b0460018b81151561106e57fe5b047001000000000000000000000000000000008b81151561108b57fe5b04611443565b8094508195508296508397505050505060018263ffffffff16027001000000000000000000000000000000008463ffffffff160217861795507001000000000000000000000000000000008163ffffffff160260018563ffffffff160217851794505b505050509250929050565b60008060008060008061119c7c01000000000000000000000000000000000000000000000000000000008981151561113357fe5b0478010000000000000000000000000000000000000000000000008a81151561115857fe5b04740100000000000000000000000000000000000000008b81151561117957fe5b047001000000000000000000000000000000008c81151561119657fe5b04611443565b93509350935093508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff16021702170217955061122e68010000000000000000898115156111f157fe5b046401000000008a81151561120257fe5b0460018b81151561120f57fe5b046c010000000000000000000000008c81151561122857fe5b04611443565b809750819450829550839650505050508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff166401000000008d0217021702170217955061131174010000000000000000000000000000000000000000888115156112a057fe5b04700100000000000000000000000000000000898115156112bd57fe5b047c01000000000000000000000000000000000000000000000000000000008a8115156112e657fe5b0478010000000000000000000000000000000000000000000000008b81151561130b57fe5b04611443565b809650819750829450839550505050508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff1602170217021794506113ab60018881151561136657fe5b046c010000000000000000000000008981151561137f57fe5b04680100000000000000008a81151561139457fe5b046401000000008b8115156113a557fe5b04611443565b809550819650829750839450505050508063ffffffff166401000000008363ffffffff166401000000008663ffffffff166401000000008963ffffffff166401000000008c021702170217021794505b505050509250929050565b60006020808302610100030360020a8381151561141f57fe5b0490505b92915050565b60006020808302610100030360020a830290505b92915050565b6000806000806000858901905063020000008163ffffffff1681151561146557fe5b046080820217881897508888019050628000008163ffffffff1681151561148857fe5b04610200820217871896508787019050620800008163ffffffff168115156114ac57fe5b046120008202178618955086860190506140008163ffffffff168115156114cf57fe5b0462040000820217891898508888888894509450945094505b50945094509450949050565b6080604051908101604052806004905b60008152602001906001900390816115045790505090565b602060405190810160405280600081525090565b60c060405190810160405280611544611597565b81526020016000801916815260200161155b6115bf565b81525090565b604080519081016040528060001515815260200161157d6115d3565b81525090565b602060405190810160405280600081525090565b6080604051908101604052806004905b60008152602001906001900390816115a75790505090565b602060405190810160405280600081525090565b6020604051908101604052806000815250905600a165627a7a72305820718ae3625e6058d510b0957d9f9393dbc4d3b279f0c9b1674b2b74cedd2ede470029"
var runnerABI = [{"constant":true,"inputs":[{"name":"input","type":"bytes"},{"name":"upToStep","type":"uint256"}],"name":"run","outputs":[{"name":"vars","type":"uint256[4]"},{"name":"proof","type":"bytes"}],"payable":false,"stateMutability":"pure","type":"function"}]

function compile() {
    const solc = require('solc')
    function readFile(name) {
        return fs.readFileSync(name, {encoding: 'utf-8'})
    }

    const compilerInput = {
        'language': 'Solidity',
        'sources': {
        'scryptFramework.sol': {'content': readFile('contracts/scryptFramework.sol')},
        'scryptRunner.sol': {'content': readFile('contracts/scryptRunner.sol')}
        }
    }
    var results = JSON.parse(solc.compileStandard(JSON.stringify(compilerInput)))
    runnerCode = '0x' + results['contracts']['scryptRunner.sol']['ScryptRunner']['evm']['bytecode']['object']
    runnerABI = results['contracts']['scryptRunner.sol']['ScryptRunner']['abi']
    console.log('var runnerCode = "' + runnerCode + '"')
    console.log('var runnerABI = ' + JSON.stringify(runnerABI) + '')
}
compile()

/* start geth using

geth --dev --rpc

then use `geth attach ipc:///tmp/ethereum_dev_mode/geth.ipc` with
var account = personal.newAccount('')
account
// and copy the account to below
personal.unlockAccount(account)
miner.setEtherbase(account)
miner.start()
*/
// Needs to be done every time: personal.unlockAccount(account)

var account = '0x19d471f5a89c491c2dd8c9c8b55538d83f784ec2'
// Remove if not deployed yet
var contractAddr = '0x1f253EfDf936Cc3eE5c8091060C8997C2688eA76'
var web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))

web3.eth.getBlockNumber()
.then(function (block) {
    console.log("At block " + block)
    if (contractAddr) {
        return new web3.eth.Contract(runnerABI, contractAddr);
    } else {
        return new web3.eth.Contract(runnerABI).deploy({data: runnerCode}).send({
            from: account,
            gas: 2000000
        })
    }
})
.then(function (runner) {
    console.log("Contract deployed at " + runner.options.address)
    var input = '0x5858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858585858'
    // At higher numbers, we get "zero" as result.
    // Might be due to a timeout? If mining is activated, the number
    // is lower.
    return runner.methods.run(input, 1).call({
        from: account
    })
})
.then(function(result) {
    console.log("Internal state:");
    console.log(web3.utils.numberToHex(result.vars[0]))
    console.log(web3.utils.numberToHex(result.vars[1]))
    console.log(web3.utils.numberToHex(result.vars[2]))
    console.log(web3.utils.numberToHex(result.vars[3]))
    console.log("Proof:")
    console.log(result.proof)
})

//var runner = new web3.eth.Contract()


// tape('Run', function (t) {
//   t.test('run', function (st) {
//       solc.com

//     var spt = spawn(st, './solcjs --version')
//     spt.stdout.match(RegExp(pkg.version + '(-[^a-zA-A0-9.+]+)?(\\+[^a-zA-Z0-9.-]+)?'))
//     spt.end()
//   })

// })