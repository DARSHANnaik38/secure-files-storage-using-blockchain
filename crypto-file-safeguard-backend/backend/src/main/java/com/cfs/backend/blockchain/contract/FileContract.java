package com.cfs.backend.blockchain.contract;

import io.reactivex.Flowable;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.Callable;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.DynamicArray;
import org.web3j.abi.datatypes.DynamicStruct;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.RemoteFunctionCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.BaseEventResponse;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tuples.generated.Tuple4;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.ContractGasProvider;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/LFDT-web3j/web3j/tree/main/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 4.14.0.
 */
@SuppressWarnings("rawtypes")
public class FileContract extends Contract {
    public static final String BINARY = "0x608060405234801561001057600080fd5b50610d9e806100206000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80632da96d7314610046578063437f8c7f14610064578063718f38a614610080575b600080fd5b61004e6100b3565b60405161005b91906106d9565b60405180910390f35b61007e60048036038101906100799190610870565b610286565b005b61009a60048036038101906100959190610959565b6103a7565b6040516100aa94939291906109f2565b60405180910390f35b60606000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020805480602002602001604051908101604052809291908181526020016000905b8282101561027d578382906000526020600020906004020160405180608001604052908160008201805461014690610a74565b80601f016020809104026020016040519081016040528092919081815260200182805461017290610a74565b80156101bf5780601f10610194576101008083540402835291602001916101bf565b820191906000526020600020905b8154815290600101906020018083116101a257829003601f168201915b50505050508152602001600182015481526020016002820180546101e290610a74565b80601f016020809104026020016040519081016040528092919081815260200182805461020e90610a74565b801561025b5780601f106102305761010080835404028352916020019161025b565b820191906000526020600020905b81548152906001019060200180831161023e57829003601f168201915b5050505050815260200160038201548152505081526020019060010190610113565b50505050905090565b6000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020604051806080016040528085815260200184815260200183815260200142815250908060018154018082558091505060019003906000526020600020906004020160009091909190915060008201518160000190816103239190610c51565b506020820151816001015560408201518160020190816103439190610c51565b506060820151816003015550503373ffffffffffffffffffffffffffffffffffffffff167f2a178308dfa4a21701ce7ab42a170e081341ffa45017df359350745ad97c377584848460405161039a93929190610d23565b60405180910390a2505050565b600060205281600052604060002081815481106103c357600080fd5b9060005260206000209060040201600091509150508060000180546103e790610a74565b80601f016020809104026020016040519081016040528092919081815260200182805461041390610a74565b80156104605780601f1061043557610100808354040283529160200191610460565b820191906000526020600020905b81548152906001019060200180831161044357829003601f168201915b50505050509080600101549080600201805461047b90610a74565b80601f01602080910402602001604051908101604052809291908181526020018280546104a790610a74565b80156104f45780601f106104c9576101008083540402835291602001916104f4565b820191906000526020600020905b8154815290600101906020018083116104d757829003601f168201915b5050505050908060030154905084565b600081519050919050565b600082825260208201905092915050565b6000819050602082019050919050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561056a57808201518184015260208101905061054f565b60008484015250505050565b6000601f19601f8301169050919050565b600061059282610530565b61059c818561053b565b93506105ac81856020860161054c565b6105b581610576565b840191505092915050565b6000819050919050565b6105d3816105c0565b82525050565b600060808301600083015184820360008601526105f68282610587565b915050602083015161060b60208601826105ca565b50604083015184820360408601526106238282610587565b915050606083015161063860608601826105ca565b508091505092915050565b600061064f83836105d9565b905092915050565b6000602082019050919050565b600061066f82610504565b610679818561050f565b93508360208202850161068b85610520565b8060005b858110156106c757848403895281516106a88582610643565b94506106b383610657565b925060208a0199505060018101905061068f565b50829750879550505050505092915050565b600060208201905081810360008301526106f38184610664565b905092915050565b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b61075182610576565b810181811067ffffffffffffffff821117156107705761076f610719565b5b80604052505050565b60006107836106fb565b905061078f8282610748565b919050565b600067ffffffffffffffff8211156107af576107ae610719565b5b6107b882610576565b9050602081019050919050565b82818337600083830152505050565b60006107e76107e284610794565b610779565b90508281526020810184848401111561080357610802610714565b5b61080e8482856107c5565b509392505050565b600082601f83011261082b5761082a61070f565b5b813561083b8482602086016107d4565b91505092915050565b61084d816105c0565b811461085857600080fd5b50565b60008135905061086a81610844565b92915050565b60008060006060848603121561088957610888610705565b5b600084013567ffffffffffffffff8111156108a7576108a661070a565b5b6108b386828701610816565b93505060206108c48682870161085b565b925050604084013567ffffffffffffffff8111156108e5576108e461070a565b5b6108f186828701610816565b9150509250925092565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610926826108fb565b9050919050565b6109368161091b565b811461094157600080fd5b50565b6000813590506109538161092d565b92915050565b600080604083850312156109705761096f610705565b5b600061097e85828601610944565b925050602061098f8582860161085b565b9150509250929050565b600082825260208201905092915050565b60006109b582610530565b6109bf8185610999565b93506109cf81856020860161054c565b6109d881610576565b840191505092915050565b6109ec816105c0565b82525050565b60006080820190508181036000830152610a0c81876109aa565b9050610a1b60208301866109e3565b8181036040830152610a2d81856109aa565b9050610a3c60608301846109e3565b95945050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b60006002820490506001821680610a8c57607f821691505b602082108103610a9f57610a9e610a45565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b600060088302610b077fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610aca565b610b118683610aca565b95508019841693508086168417925050509392505050565b6000819050919050565b6000610b4e610b49610b44846105c0565b610b29565b6105c0565b9050919050565b6000819050919050565b610b6883610b33565b610b7c610b7482610b55565b848454610ad7565b825550505050565b600090565b610b91610b84565b610b9c818484610b5f565b505050565b5b81811015610bc057610bb5600082610b89565b600181019050610ba2565b5050565b601f821115610c0557610bd681610aa5565b610bdf84610aba565b81016020851015610bee578190505b610c02610bfa85610aba565b830182610ba1565b50505b505050565b600082821c905092915050565b6000610c2860001984600802610c0a565b1980831691505092915050565b6000610c418383610c17565b9150826002028217905092915050565b610c5a82610530565b67ffffffffffffffff811115610c7357610c72610719565b5b610c7d8254610a74565b610c88828285610bc4565b600060209050601f831160018114610cbb5760008415610ca9578287015190505b610cb38582610c35565b865550610d1b565b601f198416610cc986610aa5565b60005b82811015610cf157848901518255600182019150602085019450602081019050610ccc565b86831015610d0e5784890151610d0a601f891682610c17565b8355505b6001600288020188555050505b505050505050565b60006060820190508181036000830152610d3d81866109aa565b9050610d4c60208301856109e3565b8181036040830152610d5e81846109aa565b905094935050505056fea26469706673582212202fa7ecd03fed4eaec8dfb11287757b0887e45f85c8be57d3dd4661b06d02c86764736f6c63430008130033";

    private static String librariesLinkedBinary;

    public static final String FUNC_USERFILES = "userFiles";

    public static final String FUNC_ADDFILE = "addFile";

    public static final String FUNC_GETFILES = "getFiles";

    public static final Event FILEADDED_EVENT = new Event("FileAdded", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>(true) {}, new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}, new TypeReference<Utf8String>() {}));
    ;

    protected static final HashMap<String, String> _addresses;

    static {
        _addresses = new HashMap<String, String>();
        _addresses.put("5777", "0x255680aD225fd6eDF4909B86bBe347eDff0DE75C");
    }

    @Deprecated
    protected FileContract(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected FileContract(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, credentials, contractGasProvider);
    }

    @Deprecated
    protected FileContract(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    protected FileContract(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        super(BINARY, contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static List<FileAddedEventResponse> getFileAddedEvents(
            TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = staticExtractEventParametersWithLog(FILEADDED_EVENT, transactionReceipt);
        ArrayList<FileAddedEventResponse> responses = new ArrayList<FileAddedEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            FileAddedEventResponse typedResponse = new FileAddedEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.user = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.ipfsHash = (String) eventValues.getNonIndexedValues().get(0).getValue();
            typedResponse.fileSize = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
            typedResponse.fileName = (String) eventValues.getNonIndexedValues().get(2).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public static FileAddedEventResponse getFileAddedEventFromLog(Log log) {
        Contract.EventValuesWithLog eventValues = staticExtractEventParametersWithLog(FILEADDED_EVENT, log);
        FileAddedEventResponse typedResponse = new FileAddedEventResponse();
        typedResponse.log = log;
        typedResponse.user = (String) eventValues.getIndexedValues().get(0).getValue();
        typedResponse.ipfsHash = (String) eventValues.getNonIndexedValues().get(0).getValue();
        typedResponse.fileSize = (BigInteger) eventValues.getNonIndexedValues().get(1).getValue();
        typedResponse.fileName = (String) eventValues.getNonIndexedValues().get(2).getValue();
        return typedResponse;
    }

    public Flowable<FileAddedEventResponse> fileAddedEventFlowable(EthFilter filter) {
        return web3j.ethLogFlowable(filter).map(log -> getFileAddedEventFromLog(log));
    }

    public Flowable<FileAddedEventResponse> fileAddedEventFlowable(DefaultBlockParameter startBlock,
            DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(FILEADDED_EVENT));
        return fileAddedEventFlowable(filter);
    }

    public RemoteFunctionCall<Tuple4<String, BigInteger, String, BigInteger>> userFiles(
            String param0, BigInteger param1) {
        final Function function = new Function(FUNC_USERFILES, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(param0), 
                new org.web3j.abi.datatypes.generated.Uint256(param1)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}, new TypeReference<Utf8String>() {}, new TypeReference<Uint256>() {}));
        return new RemoteFunctionCall<Tuple4<String, BigInteger, String, BigInteger>>(function,
                new Callable<Tuple4<String, BigInteger, String, BigInteger>>() {
                    @Override
                    public Tuple4<String, BigInteger, String, BigInteger> call() throws Exception {
                        List<Type> results = executeCallMultipleValueReturn(function);
                        return new Tuple4<String, BigInteger, String, BigInteger>(
                                (String) results.get(0).getValue(), 
                                (BigInteger) results.get(1).getValue(), 
                                (String) results.get(2).getValue(), 
                                (BigInteger) results.get(3).getValue());
                    }
                });
    }

    public RemoteFunctionCall<TransactionReceipt> addFile(String _ipfsHash, BigInteger _fileSize,
            String _fileName) {
        final Function function = new Function(
                FUNC_ADDFILE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Utf8String(_ipfsHash), 
                new org.web3j.abi.datatypes.generated.Uint256(_fileSize), 
                new org.web3j.abi.datatypes.Utf8String(_fileName)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteFunctionCall<List> getFiles() {
        final Function function = new Function(FUNC_GETFILES, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<DynamicArray<File>>() {}));
        return new RemoteFunctionCall<List>(function,
                new Callable<List>() {
                    @Override
                    @SuppressWarnings("unchecked")
                    public List call() throws Exception {
                        List<Type> result = (List<Type>) executeCallSingleValueReturn(function, List.class);
                        return convertToNative(result);
                    }
                });
    }

    @Deprecated
    public static FileContract load(String contractAddress, Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        return new FileContract(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    @Deprecated
    public static FileContract load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new FileContract(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static FileContract load(String contractAddress, Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return new FileContract(contractAddress, web3j, credentials, contractGasProvider);
    }

    public static FileContract load(String contractAddress, Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return new FileContract(contractAddress, web3j, transactionManager, contractGasProvider);
    }

    public static RemoteCall<FileContract> deploy(Web3j web3j, Credentials credentials,
            ContractGasProvider contractGasProvider) {
        return deployRemoteCall(FileContract.class, web3j, credentials, contractGasProvider, getDeploymentBinary(), "");
    }

    @Deprecated
    public static RemoteCall<FileContract> deploy(Web3j web3j, Credentials credentials,
            BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(FileContract.class, web3j, credentials, gasPrice, gasLimit, getDeploymentBinary(), "");
    }

    public static RemoteCall<FileContract> deploy(Web3j web3j,
            TransactionManager transactionManager, ContractGasProvider contractGasProvider) {
        return deployRemoteCall(FileContract.class, web3j, transactionManager, contractGasProvider, getDeploymentBinary(), "");
    }

    @Deprecated
    public static RemoteCall<FileContract> deploy(Web3j web3j,
            TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return deployRemoteCall(FileContract.class, web3j, transactionManager, gasPrice, gasLimit, getDeploymentBinary(), "");
    }

    public static void linkLibraries(List<Contract.LinkReference> references) {
        librariesLinkedBinary = linkBinaryWithReferences(BINARY, references);
    }

    private static String getDeploymentBinary() {
        if (librariesLinkedBinary != null) {
            return librariesLinkedBinary;
        } else {
            return BINARY;
        }
    }

    protected String getStaticDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static String getPreviouslyDeployedAddress(String networkId) {
        return _addresses.get(networkId);
    }

    public static class File extends DynamicStruct {
        public String ipfsHash;

        public BigInteger fileSize;

        public String fileName;

        public BigInteger uploadTimestamp;

        public File(String ipfsHash, BigInteger fileSize, String fileName,
                BigInteger uploadTimestamp) {
            super(new org.web3j.abi.datatypes.Utf8String(ipfsHash), 
                    new org.web3j.abi.datatypes.generated.Uint256(fileSize), 
                    new org.web3j.abi.datatypes.Utf8String(fileName), 
                    new org.web3j.abi.datatypes.generated.Uint256(uploadTimestamp));
            this.ipfsHash = ipfsHash;
            this.fileSize = fileSize;
            this.fileName = fileName;
            this.uploadTimestamp = uploadTimestamp;
        }

        public File(Utf8String ipfsHash, Uint256 fileSize, Utf8String fileName,
                Uint256 uploadTimestamp) {
            super(ipfsHash, fileSize, fileName, uploadTimestamp);
            this.ipfsHash = ipfsHash.getValue();
            this.fileSize = fileSize.getValue();
            this.fileName = fileName.getValue();
            this.uploadTimestamp = uploadTimestamp.getValue();
        }
    }

    public static class FileAddedEventResponse extends BaseEventResponse {
        public String user;

        public String ipfsHash;

        public BigInteger fileSize;

        public String fileName;
    }
}
