import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { clearAllJobErrors, fetchJobs } from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Jobs = () => {
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  //store.js ke ander hmare pass jobs reducer hai usko yha pr access kr lenege
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  const handleCityChange = (city) => {
    setCity(city);
    setSelectedCity(city);
  };

  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }

    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche]); //ye useEffect run kab hoga , jab dispatch ki value change ho , jab error ki value me change aaye mtlb manlo ki koi error aagya to ye error ko popoup krega aur saari jobs ko dobara se run krega, aur agr ab user ne city ke hisab se job search ki to ye wapas run hoga aur city ke hisab se hume job search krke de dega  , isi trha niche

  /////searchKeyword ke liye humne ek alaag cheez bnai hui hai, ise humne alag isliye rhaka knyki jab search key word me ek ek word change hoga to us hisab se
  const handleSearch = () => {
    dispatch(fetchJobs(city, niche, searchKeyword));
  };

  const cities = [
    "Mumbai",
    "Delhi",
    "Bengalore",
    "kurla",
    "Navi Mumbai",
    "marolnaka",
    "Gujrat",
    "Ahemdabad",
    "Surat",
    "Pali",
    "Bikaner",
  ];

  const nichesArray = [
    "Softwaer Devlopment",
    "Web Devlopment",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Devlopment",
    "UI/UX Design",
    "Big Data",
    "Machine Learning",
  ];

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <section className="jobs">
          <div className="search-tab-wrapper">
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button onClick={handleSearch}>Find Job</button>
            <FaSearch />
          </div>

          <div className="wrapper">
            <div className="filter-bar">
              <div className="cities">
                <h2>Filter Job By City </h2>
                {cities.map((city, index) => (
                  // index se hum uski key value ko identify kr sake, yaani first city ka index 0 ,dusri ka 1 ..so on , index hmesha unique rheta hai isiliye
                  <div key={index}>
                    <input
                      type="radio"
                      id={city}
                      name="city"
                      value={city}
                      checked={selectedCity === city} //yaaani checked pr selectedCity ko brabr kedo city ke 
                      onChange={() => handleCityChange(city)}
                    />
                    <label htmlFor={city}>{city}</label>
                  </div>
                ))}
              </div>
              {/* ////////////////////////////////////////// */}
              <div className="cities">
                <h2>Filter Job By Niche </h2>
                {nichesArray.map((niche, index) => (
                  // index se hum uski key value ko identify kr sake, yaani first city ka index 0 ,dusri ka 1 ..so on , index hmesha unique rheta hai isiliye
                  <div key={index}>
                    <input
                      type="radio"
                      id={niche}
                      name="niche"
                      value={niche}
                      checked={selectedNiche === niche}
                      onChange={() => handleNicheChange(niche)}
                    />
                    <label htmlFor={niche}>{niche}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="container">
              <div className="mobile-filter">
                {/* yaani mobile screen me dropdown se show hongw */}
                <select value={city} onChange={(e) => setCity(e.target.value)}>
                  <option value="">Filter By City</option>
                  {cities.map((city, index) => (
                    <option value={city} key={index}>
                      {city}
                    </option>
                  ))}
                </select>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                >
                  <option value="">Filter By Niche</option>
                  {nichesArray.map((niche, index) => (
                    <option value={niche} key={index}>
                      {niche}
                    </option>
                  ))}
                </select>
              </div>

              <div className="jobs_container" >
                {jobs &&
                  jobs.map((element) => {
                    // agr aap perenthesis use nhai krna chate ho , aap krli bracket hi use krna chate ho to istrha se return likhna jaroori hai
                    return (
                      <div className="card" key={element._id}>
                        {element.hiringMultipleCandidates === "Yes" ? (
                          <p className="hiring-multiple">
                            Hiring Multiple Candidates
                          </p>
                        ) : (
                          <p className="hiring">Hiring </p>
                        )}
                        <p className="title">{element.title}</p>
                        <p className="company">{element.companyName}</p>
                        <p className="location">{element.location}</p>
                        <p className="salary">
                          <span>Salary:</span>Rs.{element.salary}
                        </p>
                        <p className="posted">
                          <span>Posted On: </span>{" "}
                          {element.jobPostedOn.substring(0, 10)}
                        </p>
                        {/* <p>{element._id}</p> */}
                        <div className="btn-wrapper">
                          <Link
                            className="btn"
                            to={`/post/application/${element._id}`}
                          >
                            Apply Now
                          </Link>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Jobs;
