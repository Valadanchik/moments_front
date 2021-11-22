import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import MuiPhoneNumber from "material-ui-phone-number";

class Address extends Component {
    
    constructor(props) {
        super();
        
        this.state = {
            isLoaded: true,
            isLoggedIn: false,
            user: {},
            errorMessages: []
        }

        this.state.countries = [
          { code: 'Pakistan', name: 'Pakistan', phone: '+92' },
        ]

        this.state.states = [
          { code: 'Sindh', name: 'Sindh' },
          { code: 'Punjab', name: 'Punjab' },
          { code: 'Balochistan', name: 'Balochistan' },
          { code: 'Khyber Pakhtunkhwa', name: 'Khyber Pakhtunkhwa' }
        ]
    }

    async componentDidMount() {
        let state = localStorage["appState"];
        
        if (state) {
            let AppState = JSON.parse(state);
            await this.setState({isLoggedIn: AppState.isLoggedIn, user: AppState.user});
        }
    }

    render() {
        
        const {countries, states, user} = this.state;
        const {newAddressShow, handleSubmit, newAddressDectivate, errorMessages, handleChange, addressData} = this.props
        
        return (
            <div className={newAddressShow ? 'new-address open' : 'new-address'}>
                <form method="post" className="new-address-form" onSubmit={handleSubmit} autoComplete="off" >
                    
                    {addressData.id &&
                      <TextField id="id" className="d-none" name="id" defaultValue={addressData.id} type="hidden" />
                    }
                    
                    <div className="row mb-3">
                        <div className="col-10">
                            <h3> Address </h3>
                        </div>

                        <div className="col-2">
                            <a href="/" className="btn icon float-right" onClick={newAddressDectivate}>
                                <FontAwesomeIcon icon={faTimes} color='#495057' size='1x' />
                            </a>
                        </div>
                    </div>

                    <div className="mb-3">
                      {errorMessages.first_name
                        ? <TextField error required id="first_name" name="first_name" label="Error" defaultValue={addressData.first_name ? addressData.first_name : user.name} helperText="Incorrect entry." variant="outlined" />
                        : <TextField required id="first_name" name="first_name" defaultValue={addressData.first_name ? addressData.first_name : user.name} label="First Name" onChange={handleChange} variant="outlined" />
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.last_name
                        ? <TextField error required id="last_name" name="last_name" label="Error" defaultValue={addressData.last_name ? addressData.last_name : ''} helperText="Incorrect entry." variant="outlined" />
                        : <TextField required id="last_name" name="last_name" defaultValue={addressData.last_name ? addressData.last_name : ''} label="Last Name" onChange={handleChange} variant="outlined" />
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.email
                        ? <TextField error required id="email" name="email" label="Error" defaultValue={addressData.email ? addressData.email : user.email} helperText="Incorrect entry." onChange={handleChange} variant="outlined" />
                        : <TextField required id="email" name="email" defaultValue={addressData.email ? addressData.email : user.email} label="Email" onChange={handleChange} variant="outlined" />
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.contact_number
                        ? <MuiPhoneNumber error label="This field is required" name="contact_number" autoComplete="off" defaultCountry={'pk'} onlyCountries={['pk']} value={addressData.contact_number ? addressData.contact_number : ''} autoFormat={false} onChange={handleChange} variant="outlined" countryCodeEditable={false} />
                        : <MuiPhoneNumber name="contact_number" autoComplete="off" defaultCountry={'pk'} onlyCountries={['pk']} value={addressData.contact_number ? addressData.contact_number : ''} autoFormat={false} onChange={handleChange} variant="outlined" countryCodeEditable={false}/>
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.country_code
                        ?   <Select
                              error
                              required 
                              labelId="country_code"
                              id="country_code"
                              name="country_code"
                              value={addressData.country_code}
                              defaultValue={addressData.country_code ? addressData.country_code : 'PK'}
                              onChange={handleChange}
                              variant="outlined"
                            >
                              {countries.map((item, key) =>
                                <MenuItem key={item.id} value={item.code}>{item.name}</MenuItem>
                              )}
                            </Select>
                        :   <Select
                              required 
                              labelId="country_code"
                              id="country_code"
                              name="country_code"
                              value={addressData.country_code}
                              defaultValue={addressData.country_code ? addressData.country_code : 'Pakistan'}
                              onChange={handleChange}
                              variant="outlined"
                            >
                              {countries.map((item, key) =>
                                <MenuItem key={key} value={item.code}>{item.name}</MenuItem>
                              )}
                            </Select>
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.street_address
                        ? <TextField error required id="street_address" name="street_address" value={addressData.street_address ? addressData.street_address : ''} label="Error" defaultValue={addressData.street_address ? addressData.street_address : ''} helperText="Incorrect entry." variant="outlined" />
                        : <TextField required id="street_address" name="street_address" defaultValue={addressData.street_address ? addressData.street_address : ''} label="Street address" onChange={handleChange} variant="outlined" />
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.street_address_2
                        ? <TextField error id="street_address_2" name="street_address_2" value={addressData.street_address_2 ? addressData.street_address_2 : ''} label="Error" defaultValue={addressData.street_address_2 ? addressData.street_address_2 : ''} helperText="Incorrect entry." variant="outlined" />
                        : <TextField id="street_address_2" name="street_address_2" defaultValue={addressData.street_address_2 ? addressData.street_address_2 : ''} label="Street address 2" onChange={handleChange} variant="outlined" />
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.state
                        ?   <Select
                              native
                              error
                              required 
                              labelId="state"
                              id="state"
                              name="state"
                              value={addressData.state}
                              defaultValue={addressData.state ? addressData.state : 'Sindh'}
                              onChange={handleChange}
                              variant="outlined"
                            >
                              {states.map((item, key) =>
                                <option  key={item.id} value={item.code}>{item.name}</option>
                              )}
                            </Select>
                        :   <Select
                              native
                              required 
                              labelId="state"
                              id="state"
                              name="state"
                              value={addressData.state}
                              defaultValue={addressData.state ? addressData.state : 'Sindh'}
                              onChange={handleChange}
                              variant="outlined"
                            >
                              {states.map((item, key) =>
                                <option  key={item.id} value={item.code}>{item.name}</option>
                              )}
                            </Select>
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.city
                        ? <TextField error required id="city" name="city" label="Error" defaultValue={addressData.city ? addressData.city : ''} helperText="Incorrect entry." variant="outlined" />
                        : <TextField required id="city" name="city" defaultValue={addressData.city ? addressData.city : ''} label="City" onChange={handleChange} variant="outlined" />
                      }
                    </div>

                    <div className="mb-3">
                      {errorMessages.postal_code
                        ? <TextField error id="street_postal_code" name="postal_code" label="Error" defaultValue={addressData.postal_code ? addressData.postal_code : ''} helperText="Incorrect entry." variant="outlined" />
                        : <TextField id="street_postal_code" name="postal_code" defaultValue={addressData.postal_code ? addressData.postal_code : ''} label="Postal code" onChange={handleChange} variant="outlined" />
                      }
                    </div>

                    <div className="form-group">
                        <input type="submit" className="btn btn-sm float-left" value="Save" />
                    </div>
                </form>
            </div>
        );
    }
}

export default Address; // Don’t forget to use export default!