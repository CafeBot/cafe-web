import React from 'react';

class Paymentstatus extends React.Component {
	constructor(props) {
		super(props);
		this.state = {user:{}};
	}
	componentDidMount() {

	 }
	render() {                            
		return (
			<div>
			<h1>HELLO</h1>
			<form id="f1" name="f1" method="post" action="http://localhost:8080/paymentstatus">
				<input type="hidden" id="ORDER_ID" name="ORDER_ID" /><input type="hidden" id="CUST_ID" name="CUST_ID"/>
				<input type="hidden" id="INDUSTRY_TYPE_ID"name="INDUSTRY_TYPE_ID"value='<%= config.INDUSTRY_TYPE_ID %>'/>
				<input type="hidden" id="CHANNEL_ID" name="CHANNEL_ID" value='<%= config.CHANNEL_ID %>'/>
				<input type="hidden" id="TXN_AMOUNT" name="TXN_AMOUNT"/>
				<input type="hidden" title="MID" name="MID" value='<%= config.MID %>'/>
				<input type="hidden" name="WEBSITE" value='<%= config.WEBSITE %>'/>
				<input type="hidden" name="PAYTM_MERCHANT_KEY" value='<%= config.PAYTM_MERCHANT_KEY %>'/>
				</form>
		</div>
		)
	}
}

export default Paymentstatus;