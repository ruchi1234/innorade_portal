import React from 'react';
import { StyleSheet, css } from 'aphrodite';
import SmartPhone from 'detect-mobile-browser';
const mobile = SmartPhone(false);

import GetMaveletVideo from '../get_mavelet_video.jsx';
import Img from '../img.jsx';
import AttachIcon from '../../lib/icons/attach.jsx';

const raleway = {
  fontFamily: 'Raleway',
  fontStyle: 'normal',
  fontWeight: 'normal',
  src: "local('Raleway'), local('Raleway-Regular'), url(https://fonts.gstatic.com/s/raleway/v11/0dTEPzkLWceF7z0koJaX1A.woff2) format('woff2')",
  unicodeRange: 'U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215, U+E0FF, U+EFFD, U+F000',
};

const styles = StyleSheet.create({
  emptyStateRoot: {
    textAlign: 'center',
    padding: '24px',
    fontFamily: raleway,
  },
  hidden: {
    display: 'none',
  },
  section: {
    marginTop: '20px',
    paddingBottom: '12px',
    fontSize: '16px',
  },
  link: {
    color: 'rgb(51, 122, 183)',
  },

  inst: {
    backgroundColor: '#f4f4f4',
    display: 'inline-block',
    marginTop: '6px',
    margin: '24px',
    padding: '24px',
    flex: '1 1 50%',
  },

  instWrap: {
    display: 'flex',
  },

  instHeading: {
    fontSize: '20px',
  },
});

export default ({ handleClip }) => (
  <div>
    <div className={css(styles.emptyStateRoot, !mobile.isAny() && styles.hidden)}>
      <p className={css(styles.section)}>
        Clip products you like from retailers in the&nbsp;
        <a className={css(styles.link)}href="https://about.mavenx.com/maven-retail-network/">Maven Retailer Network</a>&nbsp;
        onto this board.
      </p>
      <p className={css(styles.section)}>
        Copy a product page URL from a retailer’s site …
      </p>
      <div className={css(styles.section)}>
        <Img src="/img/copy_url_mobile.jpg" alt="How to copy url on mobile" height={250} />
      </div>
      <p className={css(styles.section)}>
        …then, tap the “Add Clipping” button.
      </p>
      <div className={css(styles.section)}>
        <AttachIcon onClick={handleClip} size={36} />
      </div>
    </div>
    <div className={css(styles.emptyStateRoot, mobile.isAny() && styles.hidden)}>
      <p className={css(styles.section)}>
        Clip products you like from retailers in the&nbsp;
        <a
          className={css(styles.link)}
          href="https://about.mavenx.com/maven-retail-network/"
          target="_blank"
        >
          Maven Retailer Network
        </a>
        &nbsp;onto this board. There are 2 easy ways.
      </p>

      <div className={css(styles.instWrap)}>
        <div className={css(styles.inst)}>
          <p className={css(styles.section, styles.instHeading)}>
            On Computers
          </p>

          <p className={css(styles.section)}>
            Use the <a href="/tools/getmavelet">Mavelet</a> to add product clippings to this
            board while you’re shopping at online retailers’ sites.
            Or, tap the “add a clipping” button above to add a new product
            clipping.
          </p>

          <p className={css(styles.section)}>
            Watch this video to learn more
          </p>

          <p className={css(styles.section)}>
            <GetMaveletVideo width="250px" height="250px" />
          </p>
        </div>

        <div className={css(styles.inst)}>
          <p className={css(styles.section, styles.instHeading)}>
            On Any Device
          </p>
          <p className={css(styles.section)}>
            Copy a product page URL from a retailer’s site …
          </p>
          <Img src="/img/copy_url_desktop.jpg" alt="How to copy url on mobile" height={300} />
          <p className={css(styles.section)}>
            …then, tap the “Add Clipping” button.
          </p>
          <div className={css(styles.section)}>
            <AttachIcon onClick={handleClip} size={36} />
          </div>
        </div>
      </div>
    </div>
  </div>
);
