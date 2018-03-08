import React from 'react';
import { Meteor } from 'meteor/meteor';
import GetMaveletVideo from '/imports/ui/components/get_mavelet_video';
import Img from '/imports/ui/components/img';

/*
** file: client.component.footer.jsx
** by: MavenX - tewksbum May 2016
** re: navigation - top line has limited functionality.  Basically navigates
**    to main grids.  In large screen view played out across top.  In small
**    screen it should be stacked vertically and hidden off screen left.
**    Search / filter options are handled seperately.
** reference:
// http://www.w3schools.com/bootstrap/bootstrap_navbar.asp
// http://www.w3schools.com/bootstrap/tryit.asp?filename=trybs_navbar_fixed_bottom&stacked=h
*/

/*
 * These are only turned into strings for use
 */
/* global mavelet */
// const maveletLoad = `javascript: {(
//   function () {
//     window.mavenHost = '${Meteor.absoluteUrl()}';
//     var url = '${Meteor.absoluteUrl()}mavelet/maveletScraper.js?buster=' + parseInt(Math.random() * 99999999);
//     if (window.mavelet !== undefined) {
//       mavelet();
//     } else {
//       document.body.appendChild(document.createElement('script')).src = url;
//     }
//   }
// )();}`;
const maveletLoad = `
javascript:void((function(d)%7B window.mavenHost = '${Meteor.absoluteUrl()}';var e%3Dd.createElement(%27script%27)%3Be.setAttribute(%27type%27,%27text/javascript%27)%3Be.setAttribute(%27charset%27,%27UTF-8%27)%3Be.setAttribute(%27src%27,%27${Meteor.absoluteUrl()}mavelet/maveletScraper.js%3Fr%3D%27%2BMath.random()*99999999)%3Bd.body.appendChild(e)%7D)(document))%3B
`;

const GetMavelet = React.createClass({
  render() {
    return (
      <section className="get-mavelet">
        <div className="container">
          <div className="row">
            <div className="col col-xs-12 col-md-12 col-lg-12">
              <h3>Get the Mavelet</h3>
              <p>
                Want an easy way to add product clippings to Maven Xchange? Add the Mavelet
                button to your browser’s bookmark bar. With the Mavelet, adding product
                clippings is as easy as “shop and click”.
              </p>
            </div>
          </div>
          <div className="row">
            <div className="col col-xs-12 col-md-6 col-lg-6">
              <p>
                Click and drag the below Mavelet button, dropping it in the bookmark area of
                your browser.
              </p>
              <div className="mav-btn-group">
                <a
                  href={maveletLoad}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  className="btn btn-default btn-block btn-custom"
                >
                  Mavelet
                </a>
                <label>
                  Then just go shopping!
                </label>
              </div>
              <ul>
                <li>
                  Browse your favorite retail websites as you normally would.
                </li>
                <li>
                  When you see a product you like, click the Mavelet button in your
                  browser to create your product clipping.
                </li>
                <li>
                  Clip it to a board at Maven Xchange in order to save it.
                </li>
              </ul>
            </div>
            <div className="col col-xs-12 col-md-6 col-lg-6">
              <p>
                Click on the video below to learn more about adding and using the Mavelet.
              </p>
              <Img
                src="/img/ui/animated_maven.gif"
                className="gif-placeholder"
                height={400}
                width="550px"
                cover
              />
              <br></br>
              <GetMaveletVideo />
            </div>
          </div>
        </div>
      </section>
    );
  },

});

export default GetMavelet;
