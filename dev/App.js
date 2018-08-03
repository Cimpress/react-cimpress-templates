import React, {Component} from 'react'
import TemplatesSelect from '../src/TemplatesSelect'
import TemplatesSelectButton from '../src/TemplatesSelectButton'

import auth from './auth/auth'

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            logged: undefined
        }
    }

    componentWillMount() {
        if (!auth.isLoggedIn()) {
            auth
                .login(window.location.pathname + window.location.search)
                .then(() => {
                    let profile = auth.getProfile();
                    if (profile) {
                        this.setState({logged: true, token: auth.getAccessToken()})
                    } else {
                        this.setState({logged: false})
                    }
                })
                .catch(catchErr => {
                    this.setState({logged: false})
                });
        }
    }

    renderBox(content) {
        return <div style={{border: "1px solid red", padding: "10px", marginBottom: '10px'}}>
            {content}
        </div>
    }

    getSamples() {
        return [
            {
                caption: 'Provided list of templates',
                render: <TemplatesSelect
                    key={0} templates={[{
                    templateId: 't1'
                }, {
                    templateId: 't2'
                }, {
                    templateId: 't3'
                }]}
                    selectedTemplateId={this.state.lastTemplateId}
                    onChange={templateId => this.setState({lastTemplateId: templateId})}/>
            },
            {
                caption: 'Get templates from service',
                render: <TemplatesSelect
                    accessToken={this.state.token}
                    selectedTemplateId={this.state.lastTemplateId}
                    onChange={templateId => this.setState({lastTemplateId: templateId})}/>
            },
            {
                caption: 'Get templates from service, plain select',
                render: <TemplatesSelect
                    accessToken={this.state.token} showAddNew={false}
                    selectedTemplateId={this.state.lastTemplateId}
                    onChange={templateId => this.setState({lastTemplateId: templateId})}/>
            },
            {
                caption: 'Open template selection',
                render: <TemplatesSelectButton
                    accessToken={this.state.token}
                    onConfirm={templateId => this.setState({lastTemplateId: templateId})}/>
            }
        ]
    }

    render() {
        if (!this.state.logged) {
            return 'Getting token...'
        }

        return <div>
            lastTemplateId: <strong>{this.state.lastTemplateId}</strong>
            <hr/>
            {this.getSamples().map(a => this.renderBox(
                <div>
                    <h6>{a.caption}</h6>
                    {a.render}
                </div>
            ))}
        </div>

    }

}