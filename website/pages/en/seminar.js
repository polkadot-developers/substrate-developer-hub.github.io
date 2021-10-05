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

function Seminar(props) {
  const { config: siteConfig, language = '' } = props
  const { baseUrl, docsUrl } = siteConfig
  const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`
  const langPart = `${language ? `${language}/` : ''}`
  const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`
  const pageUrl = doc => `${baseUrl}${langPart}${doc}`

  return (
    <section className='main-container' id='seminar'>
      <section className='text-center height-70 imagebg hero' data-overlay='6'>
        <div
          className='background-image-holder'
          style={{
            backgroundImage: `url('/img/rust-code-alt.jpg')`
          }}
        />
        <div className='container pos-vertical-center mt--1'>
          <div className='row'>
            <div className='col-md-12'>
              <h1>
                <span className='c-accent' style={{ marginBottom: '8px', display: 'inline-block' }}>
                  <translate>Substrate Seminar</translate>
                </span>{' '}
                <br />
                <translate>A Collaborative Learning Group</translate>
              </h1>
              <p className='h3 type--subhead'><translate>
                Substrate Seminar is an open collaborative learning call <br />where we learn about
                Substrate together.
              </translate></p>
              <section>
                <a target='_blank' className='btn btn-lg primary-color mx-5'
                  href='https://www.crowdcast.io/e/substrate-seminar-2'>
                  <translate>Live Call</translate>
                </a>
                <a className='btn btn-lg secondary-color mx-5'
                  href='past-seminars'>
                  <translate>Past Seminars</translate>
                </a>
              </section>
            </div>
          </div>
        </div>
      </section>

      <section className='switchable switchable--switch intro'>
        <div className='container'>

          <div className='row justify-content-between'>
            <div className='col-md-8 col-lg-7 left'>
              <h2><translate>An open collaborative learning call</translate></h2>
              <p className='lead'><translate>
                Substrate Seminar is an open Collaborative Learning call where we learn about Substrate
                together. Run by DevHub, we meet every other Tuesday at 14:00UTC. Learn, show off a Substrate
                project, and make friends!
              </translate></p>
              <a href='https://calendar.google.com/calendar/b/1?cid=cGFyaXR5LmlvXzJmc2tqN245cm1qcHE1Y2xiOWc3ZWUzZGhvQGdyb3VwLmNhbGVuZGFyLmdvb2dsZS5jb20'>
                <translate>Add next call to Google Calendar »</translate>
              </a>
            </div>
          </div>
          <hr />

          <div className='row justify-content-between pt-0 faqs'>
            <div className='col-md-6'>
              <h2 style={{ fontSize: '32px' }}><translate>FAQ</translate></h2>
              <section>
                <h4 className='mb-2'><translate>Can I ask my own questions?</translate></h4>
                <p>
                  <translate>
                  Yes! The second half of every Seminar is for open Q & A like office hours. You can ask questions or even bring your code that doesn't compile. Participants will be invited on-screen to share their work and their questions. You may also join us between Seminars on
                  </translate>
                  &nbsp;
                  <a href="https://matrix.to/#/!oClBfIbtucPfGKlNpk:matrix.parity.io">Element</a>.
                </p>
              </section>

              <section>
                <h4 className='mb-2'><translate>
                  I am not a [Substrate] developer, can I still participate?
                </translate></h4>
                <p><translate>
                  Yes! The seminar is open to everyone. The content is generally more developer-oriented,
                  but less technical participants and questions are also welcome. If your questions turn
                  out to be off-topic, we'll point you to a better resource.
                </translate></p>
              </section>

              <section>
                <h4 className='mb-2'><translate>Where are the recordings?</translate></h4>
                <p className='mb-2'><translate>
                  Seminar has changed formats a few times so the recordings are in a few places:
                </translate></p>
              </section>
              <section>
                <ul>
                  <li>
                    <a href='./past-seminars'>
                      List of seminars starting from 2021 Jan
                    </a>.
                  </li>
                  <li>
                    <a href='https://www.crowdcast.io/e/substrate-seminar/'>
                      <translate>23 June 2020 and later</translate>
                    </a>
                    &nbsp;
                    <translate>are on Crowdcast.</translate>
                  </li>
                  <li>
                    <a href='https://www.youtube.com/watch?v=XoL1Ur_6Lxk&list=PLp0_ueXY_enXRfoaW7sTudeQH10yDvFOS'>
                      <translate>19 November 2019 - 23 June 2020</translate>
                    </a>
                    &nbsp;
                    <translate>are on the Substrate Seminar YouTube playlist.</translate>
                  </li>
                  <li>
                    <a href='https://www.youtube.com/playlist?list=PLp0_ueXY_enUCPszf_3Q9ZxovLvKm1eMx'>
                      <translate>03 June 2019 - 02 November 2019</translate>
                    </a>
                    &nbsp;
                    <translate>are on the Substrate Collaborative Learning YouTube playlist.</translate>
                  </li>
                </ul>
              </section>
            </div>
            <div className='col-md-6 second'>

              <h2 style={{ fontSize: '32px' }}><translate>Upcoming seminars</translate></h2>

              <p><a href='https://www.crowdcast.io/e/substrate-seminar-2/4'><strong>5 Oct. </strong></a>
              <translate>In this seminar Parity Developer Advocate, Sacha Lansky will go over how to use FRAME’s benchmarking tool to correctly adjust weight values for the dispatch calls of your pallet.</translate></p>

              <p><strong>19 Oct. </strong><translate>TBD.</translate></p>

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

module.exports = Seminar
