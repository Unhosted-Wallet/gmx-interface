import { Trans } from "@lingui/macro";
import cx from "classnames";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import { getAppBaseUrl, isHomeSite, shouldShowRedirectModal } from "lib/legacy";
import { SOCIAL_LINKS, getFooterLinks } from "./constants";

import ExternalLink from "components/ExternalLink/ExternalLink";
import { UserFeedbackModal } from "../UserFeedbackModal/UserFeedbackModal";

import logoImg from "img/ic_gmx_footer.svg";
import logoImgGmx from "img/ic_gmx_footer_1.svg";

import { TrackingLink } from "components/TrackingLink/TrackingLink";
import { userAnalytics } from "lib/userAnalytics";
import { LandingPageFooterMenuEvent } from "lib/userAnalytics/types";
import "./Footer.css";

type Props = { showRedirectModal?: (to: string) => void; redirectPopupTimestamp?: number };

export default function Footer({ showRedirectModal, redirectPopupTimestamp }: Props) {
  const isHome = isHomeSite();
  const [isUserFeedbackModalVisible, setIsUserFeedbackModalVisible] = useState(false);

  return (
    <footer>
    <div className='Footer-wrapper'>
      <div className='Footer-logo-wrapper'>
        <div className="Footer-logo">
          <img draggable={false}  src={logoImg} alt="Unhosted" />
        </div>
        <div className="Footer-logo">
          <img draggable={false} className="w-80" src={logoImgGmx} alt="GMX" />
        </div>
      </div>
    <div className="Footer-social-link-block">
      {SOCIAL_LINKS.map((platform) => {
        return (
          <TrackingLink
            key={platform.name}
            onClick={async () => {
              await userAnalytics.pushEvent<LandingPageFooterMenuEvent>(
                {
                  event: "LandingPageAction",
                  data: {
                    action: "FooterMenu",
                    button: platform.name,
                  },
                },
                { instantSend: true }
              );
            }}
          >
            <ExternalLink className="App-social-link" href={platform.link}>
              <div className='social-link'>
                <img draggable={false} src={platform.icon} alt={platform.name} width={20} height={20} />
                <span className='social-link-name'>{platform.name}</span>
              </div>
            </ExternalLink>
          </TrackingLink>
        );
      })}
    </div>
    </div>
    <div>
      <div className="Footer-links">
        {getFooterLinks(isHome).map(({ external, label, link, isAppLink }) => {
          if (external) {
            return (
              <ExternalLink key={label} href={link} className="Footer-link">
                {label}
              </ExternalLink>
            );
          }
          if (isAppLink) {
            if (shouldShowRedirectModal(redirectPopupTimestamp)) {
              return (
                <div
                  key={label}
                  className="Footer-link a"
                  onClick={() => showRedirectModal && showRedirectModal(link)}
                >
                  {label}
                </div>
              );
            } else {
              const baseUrl = getAppBaseUrl();
              return (
                <a key={label} href={baseUrl + link} className="Footer-link">
                  {label}
                </a>
              );
            }
          }
          return (
            <NavLink key={link} to={link} className="Footer-link" activeClassName="active">
              {label}
            </NavLink>
          );
        })}
        {!isHome && (
          <div className="Footer-link" onClick={() => setIsUserFeedbackModalVisible(true)}>
            <Trans>Leave feedback</Trans>
          </div>
        )}
      </div>
      {!isHome && (
        <UserFeedbackModal isVisible={isUserFeedbackModalVisible} setIsVisible={setIsUserFeedbackModalVisible} />
      )}
    </div>
  </footer>
  );
}
