import { check, Match } from 'meteor/check';

/**
 * file: server.api.comJ.js
 * by: MavenX - tewksbum Mar 2016
 * re: affiliate code for CJ
 * ref:

/*Commission Junction documentation:
 * http://cjsupport.custhelp.com/app/answers/detail/a_id/1698/related/1
 * http://cjsupport.custhelp.com/app/answers/detail/a_id/568 (AID, PID, CID)
 * http://cjsupport.custhelp.com/app/answers/detail/a_id/869/related/1 (SID) - I think we'd use this to track the huntId
 */

// deep link automation
// <script src="//www.anrdoezrs.net/am/7954977/include/allCj/sid/12345biteme/am.js"></script>

// http://www.anrdoezrs.net/links/7954977/type/dlg/sid/my%20SID/http://www.abesofmaine.com/128GB_Class_10_Ultra_SDXC_UHS-I_Memory_Card_30_MB_s_Read_Speed_1000466.html
// http://www.anrdoezrs.net/links/7954977/type/dlg/sid/hid-asf2378234z%3Bpid-3489sdf23/http://www.abesofmaine.com/Samsung_UN55JS7000_55-Inch_4K_Ultra_HD_Smart_LED_TV_1009778.html

const getCJLink = (gonkAttributes) => {
  console.log('in CJ');

  // check(gonkAttributes, {
  //   url: Match(String),
  //   callback: Match(String),
  // });
  check(gonkAttributes, Object);

  let response = 'http://www.anrdoezrs.net/links/<<<PID>>>/type/dlg/sid/<<<SID>>>/<<<URL>>>';
  const pid = 7954977;  // this code is our CJ site id for mavenxinc.com

  response = response.replace('<<<PID>>>', pid);
  response = response.replace('<<<SID>>>', gonkAttributes.callback);
  response = response.replace('<<<URL>>>', gonkAttributes.url);

  return response;  // we shouldn't need to return encodeURI()
};

export { getCJLink };
