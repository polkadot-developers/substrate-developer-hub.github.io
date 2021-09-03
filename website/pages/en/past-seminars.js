/**
 * Copyright 2019 Parity Technologies
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at

 *     http://www.apache.org/licenses/LICENSE-2.0

 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const React = require('react')

const FullSplash = require(`${process.cwd()}` + `/core/FullSplash`)

const Container = require('../../../../react-bootstrap/Container')
const Button = require('../../../../react-bootstrap/Button')
const translate = require('../../server/translate').translate
const seminars = require(`${process.cwd()}` + `/data/past-seminars.json`)

function renderTable(seminars) {
  return <table className="table table-hover">
    <colgroup>
      <col style={{width:"140px"}}/>
      <col/>
      <col/>
      <col style={{minWidth: "200px"}}/>
    </colgroup>
    <thead>
      <tr>
        <th scope="col">Date</th>
        <th scope="col">Speaker(s)</th>
        <th scope="col">Description</th>
        <th scope="col">Tags</th>
      </tr>
    </thead>
    <tbody>{
      seminars.map((seminar, sidx) => <tr key={`seminar-${sidx}`}>
        <td className="text-sm">{seminar.date}</td>
        <td className="text-sm" dangerouslySetInnerHTML={{__html: seminar.speakers.join('<br/>')}} />
        <td>
          <a target="_blank" href={seminar.link} dangerouslySetInnerHTML={{__html: seminar.description}} />
        </td>
        <td>
          {seminar.tags.map((tag, tidx) =>
            <span key={`tag-${sidx}-${tidx}`} className="badge badge-pill badge-primary mx-1">{tag}</span>
          )}
        </td>
      </tr>)
    }
    </tbody>
  </table>;
}

function PastSeminars(props) {
  const { config: siteConfig, language = '' } = props
  const { baseUrl, docsUrl } = siteConfig
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
  const langPart = `${language ? `${language}/` : ''}`
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`
  const pageUrl = doc => `${baseUrl}${langPart}${doc}`

  return (
    <section className='main-container' id='seminar'>
      <section className='text-center imagebg hero height-200' data-overlay='6'>
        <div
          className='background-image-holder'
          style={{
            backgroundImage: `url('/img/rust-code-alt.jpg')`
          }}
        />
        <div className='container pos-vertical-center mt--1'>
          <div className='row'>
            <div className='col-md-12'>
              <h1><span className='c-accent' style={{ marginBottom: '8px', display: 'inline-block' }}>
                  <translate>Past Substrate Seminars</translate>
              </span></h1>
            </div>
          </div>
        </div>
      </section>

      <section className='switchable switchable--switch intro' id='past-seminars'>
        <div className='container'>

          <ul className='nav nav-pills mb-3' id='pills-seminars-tab' role='tablist'>
            <li className='nav-item mx-3'>
              <a className='nav-link active' id='pills-2021-tab' data-toggle='pill' href='#pills-2021' role='tab'>2021</a>
            </li>
            <li className='nav-item mx-3'>
              <a className='nav-link' id='pills-2020-tab' data-toggle='pill' href='#pills-2020' role='tab'>2020</a>
            </li>
          </ul>

          <div className="table-responsive tab-content" id='pills-seminars-tabContent'>
            <div className='tab-pane active' id='pills-2021' role='tabpanel'>
              { renderTable(seminars["2021"]) }
            </div>
            <div className='tab-pane' id='pills-2020' role='tabpanel'>
              { renderTable(seminars["2020"]) }
            </div>
          </div>

        </div>
      </section>

      <section className='bg--secondary'>
        <div
          className='container'
          style={{
            textAlign: 'center',
            padding: '80px 0 40px 0'
          }}>
          <div className='row'>
            <div className='col-md-12 col-lg-12'>
              <div className='cta'>
                <h2 style={{ margin: '0 0 10px 0' }}>
                  <translate>Don't want to miss the next Substrate seminar?</translate>
                </h2>
                <section className='button-wrap'>
                  <Button
                    className='btn btn--white primary-color'
                    href='https://calendar.google.com/calendar/b/1?cid=cGFyaXR5LmlvXzJmc2tqN245cm1qcHE1Y2xiOWc3ZWUzZGhvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'>
                    <span className='btn__text'><translate>
                      Add to Google Calendar
                    </translate></span>
                  </Button>
                </section>
                <section>
                  <span className='block type--fine-print'>
                    <translate>or</translate>
                    &nbsp;
                    <a href='https://www.crowdcast.io/e/substrate-seminar-2'>
                      <translate>join live call »</translate>
                    </a>
                  </span>
                </section>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}

module.exports = PastSeminars
