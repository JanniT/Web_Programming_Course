import React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import { Link as RouterLink } from 'react-router-dom'
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
// import { changeLanguage } from 'i18next'

function Header() {

  const { t, i18n } = useTranslation()

  const changeLanguage = (language) => {
    i18n.changeLanguage(language)
  }

  return (
    <React.Suspense fallback="loading">
      <div>
        <AppBar position="static">
        <Toolbar>
          <Button component={RouterLink} to="/" color="inherit">
            {t('Home')}
          </Button>
          <Button component={RouterLink} to="/about" color="inherit">
            {t('About')}
          </Button>

          <Button color="inherit" id ="fi" onClick={() => changeLanguage("fi")}>
            FI
          </Button>

          <Button color="inherit" id="en" onClick={() => changeLanguage("en")}>
            ENG
          </Button>

        </Toolbar>
        </AppBar>
        <>{t('This is the front page')}</>
      </div>
    </React.Suspense>
  )
}

export default Header