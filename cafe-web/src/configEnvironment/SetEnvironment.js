import React from 'react';

class SetEnvironment  extends React.Component{
        constructor(props) {
		super(props);
		this.state = {baseURL : 'http://localhost:8080'};
	}
	static getBaseUrl(){
		return this.state.baseURL;
	}
}

export default SetEnvironment;