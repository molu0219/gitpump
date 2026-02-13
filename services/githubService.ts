
export const getRepoData = async (githubUrl: string) => {
  try {
    const url = new URL(githubUrl.trim().replace(/\/$/, ''));
    const pathParts = url.pathname.split('/').filter(p => p);
    const owner = pathParts[0];
    const repo = pathParts[1];

    // 1. Fetch Repository Stats via GitHub API
    const apiResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!apiResponse.ok) throw new Error('Repository not found on GitHub');
    const stats = await apiResponse.json();

    // 2. Fetch README content directly from raw source
    let readmeText = '';
    const branches = ['main', 'master', 'dev', 'develop'];
    const filenames = ['README.md', 'readme.md', 'README.MD', 'README'];
    
    // Attempt common combinations
    for (const branch of branches) {
      if (readmeText) break;
      for (const filename of filenames) {
        try {
          const readmeResponse = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filename}`);
          if (readmeResponse.ok) {
            readmeText = await readmeResponse.text();
            break;
          }
        } catch (e) {}
      }
    }

    if (!readmeText) {
      readmeText = stats.description || "No detailed README found. Please visit the GitHub repository for documentation and source code.";
    }

    // Limit README size to avoid database bloat while keeping enough for preview
    const truncatedReadme = readmeText.substring(0, 5000);

    return {
      owner: owner,
      repoName: repo,
      summary: truncatedReadme,
      tags: stats.topics && stats.topics.length > 0 ? stats.topics : [stats.language || 'Code', 'Web3', 'OpenSource'],
      stars: stats.stargazers_count,
      forks: stats.forks_count,
    };
  } catch (error) {
    console.error('GitHub fetch failed:', error);
    throw error;
  }
};
