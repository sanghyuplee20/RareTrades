export default function Navbar() {
    return (
        <nav>
            <a href="recommendation" class="logo-link">
                <h1 className="logo">RareTrades</h1>
            </a>
            <ul className="nav-links">
                <li><a href="recommendation">Recommendations</a></li>
                <li><a href="search">Search</a></li>
                <li><a href="ranking">Ranking</a></li>
                <li><a href="about">About</a></li>
                <li><a href="login">Log In</a></li>
            </ul>
        </nav>
    )
}