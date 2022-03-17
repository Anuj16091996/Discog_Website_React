import React from 'react'
import   './Header.css'

class Header extends React.Component{
    render () {
        if (this.props.name) {
            return (
                    <header>

                         <h2> {this.props.name} </h2>

                    </header>
            )
        }else {
                return(
                    <div>Error Link not provided</div>
                )
        }

    }
}

export default Header