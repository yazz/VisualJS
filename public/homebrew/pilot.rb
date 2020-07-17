require "language/node"

class Pilot < Formula
  desc "The flexible, powerful and beautiful programming language"
  homepage "https://appshare.co"
  url "http://0.0.0.0/yazz.zip"
  sha256 ""

  depends_on "node"

  def install
    system "npm", "install", *Language::Node.std_npm_install_args(libexec)
    bin.install_symlink Dir["#{libexec}/bin/*"]
  end

  test do
    # add a meaningful test here
  end
end
