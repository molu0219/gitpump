
export const getRepoData = async (githubUrl: string) => {
  try {
    const url = new URL(githubUrl.trim().replace(/\/$/, ''));
    const [, owner, repo] = url.pathname.split('/');
    if (!owner || !repo) throw new Error('Invalid URL');

    const apiResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    if (!apiResponse.ok) throw new Error('Repository not found');
    const stats = await apiResponse.json();

    // Optimizing README fetch: Try main branch first, then master
    let readmeText = '';
    const branches = [stats.default_branch || 'main', 'master'];
    const filenames = ['README.md', 'readme.md'];
    
    for (const branch of branches) {
      if (readmeText) break;
      for (const filename of filenames) {
        try {
          const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filename}`);
          if (res.ok) {
            readmeText = await res.text();
            break;
          }
        } catch {}
      }
    }

    return {
      owner,
      repoName: repo,
      summary: (readmeText || stats.description || "Source verified.").substring(0, 4000),
      tags: stats.topics?.length ? stats.topics : [stats.language || 'Web3', 'Solana'],
      stars: stats.stargazers_count,
      forks: stats.forks_count,
    };
  } catch (error) {
    console.error('GitHub Sync Error:', error);
    throw error;
  }
};
