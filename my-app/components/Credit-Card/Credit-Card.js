import React from 'react';
import { useState, useRef } from 'react';
import { Alert, Modal, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { PagSeguro } from '../PagSeguroEncryptCard/pagseguro.min.js';
import { Button } from 'react-native-paper';
import { TextInputMask } from 'react-native-masked-text'
const styles = StyleSheet.create({
	creditCard: {
		height: 190,
		width: 350,
		borderRadius: 5
	},
	flagCard: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
		marginTop: 20,
		marginLeft: 20,
	},
	creditCardInfos: {
		margin: 20,
	},
	creditCardInfosContent: {
		marginTop: 20
	},
	creditCardInfosText: {
		color: 'white',
		fontSize: 20,
		fontWeight: 'bold',
	},
	creditCardInfosTextLabel:{
		color: 'white',
		fontSize: 12
	},
	creditCardInfosTextNameDate: {
		flexDirection: 'row',
		justifyContent: "space-between",
		marginTop: 20
	},
	inputCardNumberNameCpf: {
		height: 40,
		margin: 12,
		width: 320,
		borderWidth: 0.5,
		padding: 10,
		borderRadius: 4
	},
	imputCardValid: {
		height: 40,
		margin: 12,
		width: 155,
		borderWidth: 0.5,
		padding: 10,
		borderRadius: 5
	},
	imputCardSecurity: {
		height: 40,
		margin: 12,
		width: 140,
		borderWidth: 0.5,
		padding: 10,
		borderRadius: 5
	},
	stepTwoCard: {
		flexDirection: 'row'
	},
	stepTreeCardButtons: {
		margin: 12,
		flexDirection: 'row'
	},
	btnConfirm: {
		borderRadius: 4,
		padding: 10,
		elevation: 2,
		backgroundColor: '#222761',
		alignItems: 'center'
	},
	btnCancelClose: {
		borderRadius: 4,
		padding: 10,
		elevation: 2,
		backgroundColor: '#ED2026',
		alignItems: 'center'
	},
	btnConfirmText: {
		color: 'white',
	},
	centeredView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 22,
	},
	modalView: {
		margin: 20,
		width: '90%',
		height: '20%',
		backgroundColor: 'white',
		borderRadius: 4,
		padding: 35,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: {
		  width: 0,
		  height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalText: {
		margin: 20
	}
});


export default function CreditCard() {
	const [ typeCreditCard, setTypeCreditCard ] = useState('???');
	const [modalVisible, setModalVisible] = useState(false);
	const cpfRef = useRef(null);
	const cardRef = useRef(null);
	const cardValidRef = useRef(null);
	const [messageAlert, setmessageAlert] = useState({
		message: ''
	});
	const [ values, setValues ] = useState({
		numberCard: null,
		numberCpf: null,
		nameUser: null,
		dateValid: null,
		codSecurity: null
	});


	const cartoes = {
		Visa: /^4[0-9]{12}(?:[0-9]{3})/,
		Mastercard: /^2[1-5][0-9]{14}/,
		Amex: /^3[47][0-9]{13}/,
		DinersClub: /^3(?:0[0-5]|[68][0-9])[0-9]{11}/,
		Discover: /^6(?:011|5[0-9]{2})[0-9]{12}/,
		JCB: /^(?:2131|1800|35\d{3})\d{11}/
	};

	function testarCC(nr, cartoes) {
		for (var cartao in cartoes) if (nr.match(cartoes[cartao])) return cartao;
		return false;
	}
	function criptografarCard(){
		const numberCard = cardRef?.current.getRawValue();
		const validCard = cardValidRef?.current.getRawValue();
		let card = PagSeguro.encryptCard({
			publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAr+ZqgD892U9/HXsa7XqBZUayPquAfh9xx4iwUbTSUAvTlmiXFQNTp0Bvt/5vK2FhMj39qSv1zi2OuBjvW38q1E374nzx6NNBL5JosV0+SDINTlCG0cmigHuBOyWzYmjgca+mtQu4WczCaApNaSuVqgb8u7Bd9GCOL4YJotvV5+81frlSwQXralhwRzGhj/A57CGPgGKiuPT+AOGmykIGEZsSD9RKkyoKIoc0OS8CPIzdBOtTQCIwrLn2FxI83Clcg55W8gkFSOS6rWNbG5qFZWMll6yl02HtunalHmUlRUL66YeGXdMDC2PuRcmZbGO5a/2tbVppW6mfSWG3NPRpgwIDAQAB",
			holder: values.nameUser,
			number: numberCard.join(""),
			expMonth: values.dateValid.split('/')[0],
			expYear: values.dateValid.split('/')[1],
			securityCode: "123"
		});
		let encrypted = card.encryptedCard;
		if (encrypted) {
			setmessageAlert({
				message: 'Criptografado com Sucesso !'
			})
			setModalVisible(true)
		}
	}

	const handleChange = (name, value) => {
		switch (true) {
			case (name == 'nameUser'|| name == 'codSecurity'|| name == 'numberCpf'|| name == 'dateValid'|| name == 'codSecurity') :
					setValues({
						...values,
						[name]: value,
					});
				break;
			case name == 'numberCard':
					if(cardRef.current.getRawValue().length >= 3){
						const numberCard = cardRef?.current.getRawValue();
						if(testarCC(numberCard.join(""), cartoes) != false) setTypeCreditCard(testarCC(numberCard.join(""), cartoes))
						if(testarCC(numberCard.join(""), cartoes) == false) setTypeCreditCard('???')
						setValues({
							...values,
							[name]: value,
						});
					}else{
						setValues({
							...values,
							[name]: value,
						});
					}
				break;
			default:
				break;
		}
	  };
  return (
    <View>
		<Modal
			animationType="slide"
			transparent={true}
			visible={modalVisible}
			onRequestClose={() => {
			Alert.alert('Modal has been closed.');
			setModalVisible(!modalVisible);
			}}>
			<View style={styles.centeredView}>
			<View style={styles.modalView}>
				<Text style={styles.modalText}>{messageAlert.message}</Text>
				<Button mode="elevated" textColor="#FFFFFF" buttonColor='#222761' onPress={() => setModalVisible(!modalVisible)}>
					Ok
				</Button>
			</View>
			</View>
		</Modal>
		<LinearGradient
			colors={['#222761', '#25459B']}
			start={{ x: 1, y: 0 }}
			end={{ x: 0, y: 1 }}
			style={styles.creditCard}>
					<Text style={styles.flagCard}>{typeCreditCard}</Text>
					<View style={styles.creditCardInfos}>
						<View style={styles.creditCardInfosContent}>
							<Text style={styles.creditCardInfosText}>{values.numberCard != null ? values.numberCard : '0000-0000-0000-0000'}</Text>
							<View style={styles.creditCardInfosTextNameDate}>
								<View style={styles.creditCardInfosTextName}>
									<Text style={styles.creditCardInfosTextLabel}>Nome</Text>
									<Text style={styles.creditCardInfosText}>{values.nameUser != null ? values.nameUser : 'NOME SOBRENOME'}</Text>
								</View>
								<View style={styles.creditCardInfosTextDate}>
									<Text style={styles.creditCardInfosTextLabel}>Validade</Text>
									<Text style={styles.creditCardInfosText}>{values.dateValid != null ? values.dateValid : '00/0000'}</Text>
								</View>
							</View>
						</View>
					</View>
		</LinearGradient>

		<View style={styles.stepOneCard}>
			<TextInput
				style={styles.inputCardNumberNameCpf}
				placeholder='NOME SOBRENOME'
				onChangeText={ (text) => handleChange('nameUser', text)}
			/>
			<TextInputMask
				style={styles.inputCardNumberNameCpf}
				placeholder='000.000.000-00'
				type={'cpf'}
				onChangeText={ (text) => handleChange('numberCpf', text)}
				ref={cpfRef}
			/>
			<TextInputMask
				type={'credit-card'}
				placeholder='0000.0000.0000.0000'
				style={styles.inputCardNumberNameCpf}
				value={values.numberCard}
				onChangeText={ (text) => handleChange('numberCard', text)}
				ref={cardRef}
			/>
			</View>
			<View style={styles.stepTwoCard}>

				<TextInputMask
					style={styles.imputCardValid}
					placeholder='00/00'
					type={'datetime'}
					options={{
						format: 'MM/YYYY'
					}}
					ref={cardValidRef}
					onChangeText={ (text) => handleChange('dateValid', text)}
				/>
				<TextInputMask
					style={styles.imputCardSecurity}
					placeholder='000'
					type={'custom'}
					options={{
						mask: '999',
					}}
					onChangeText={ (text) => handleChange('codSecurity', text)}
				/>
			</View>
			<View style={styles.stepTreeCard}>
				<Button mode="elevated" textColor="#FFFFFF" buttonColor='#222761' onPress={() => criptografarCard()}>
					Confirmar
				</Button>
			</View>
    </View>
  );
}
